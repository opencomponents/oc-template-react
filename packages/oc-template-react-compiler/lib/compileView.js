"use strict";

const async = require("async");
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const MemoryFS = require("memory-fs");
const minifyFile = require("oc-minify-file");
const ocViewWrapper = require("oc-view-wrapper");
const path = require("path");
const reactComponentWrapper = require("oc-react-component-wrapper");
const strings = require("oc-templates-messages");

const {
  compiler,
  configurator: { client: webpackConfigurator }
} = require("./to-abstract-base-template-utils/oc-webpack");

const fontFamilyUnicodeParser = require("./to-abstract-base-template-utils/font-family-unicode-parser");
const reactOCProviderTemplate = require("./reactOCProviderTemplate");
const viewTemplate = require("./viewTemplate");

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  let viewPath = path.join(options.componentPath, viewFileName);
  if (process.platform === "win32") {
    viewPath = viewPath.split("\\").join("\\\\");
  }
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || "template.js";
  const componentPackage = options.componentPackage;
  const { getInfo } = require("../index");
  const externals = getInfo().externals;
  const production = options.production;

  const reactOCProviderContent = reactOCProviderTemplate({ viewPath });
  const reactOCProviderName = "reactOCProvider.js";
  const reactOCProviderPath = path.join(
    publishPath,
    "temp",
    reactOCProviderName
  );

  const compile = (options, cb) => {
    const config = webpackConfigurator({
      viewPath: options.viewPath,
      externals: externals.reduce((externals, dep) => {
        externals[dep.name] = dep.global;
        return externals;
      }, {}),
      publishFileName,
      production,
      buildIncludes: componentPackage.oc.files.template.buildIncludes || []
    });
    compiler(config, (err, data) => {
      if (err) {
        return cb(err);
      }

      const memoryFs = new MemoryFS(data);
      const bundle = memoryFs.readFileSync(
        `/build/${config.output.filename}`,
        "UTF8"
      );

      const bundleHash = hashBuilder.fromString(bundle);
      const bundleName = "react-component";
      const bundlePath = path.join(publishPath, `${bundleName}.js`);
      const wrappedBundle = reactComponentWrapper(bundleHash, bundle);
      fs.outputFileSync(bundlePath, wrappedBundle);

      let css = null;
      if (data.build["main.css"]) {
        // This is an awesome hack by KimTaro that will blow your mind.
        // Remove it once this get merged: https://github.com/webpack-contrib/css-loader/pull/523
        css = fontFamilyUnicodeParser(
          memoryFs.readFileSync(`/build/main.css`, "UTF8")
        );

        // We convert single quotes to double quotes in order to
        // support the viewTemplate's string interpolation
        css = minifyFile(".css", css).replace(/\'/g, '"');
        const cssPath = path.join(publishPath, `styles.css`);
        fs.outputFileSync(cssPath, css);
      }

      const reactRoot = `oc-reactRoot-${componentPackage.name}`;
      const templateString = viewTemplate({
        reactRoot,
        css,
        externals,
        bundleHash,
        bundleName
      });

      const templateStringCompressed = production
        ? templateString.replace(/\s+/g, " ")
        : templateString;
      const hash = hashBuilder.fromString(templateStringCompressed);
      const view = ocViewWrapper(hash, templateStringCompressed);
      return cb(null, {
        template: { view, hash },
        bundle: { hash: bundleHash }
      });
    });
  };

  async.waterfall(
    [
      next => fs.outputFile(reactOCProviderPath, reactOCProviderContent, next),
      next => compile({ viewPath: reactOCProviderPath }, next),
      (compiled, next) =>
        fs.remove(reactOCProviderPath, err => next(err, compiled)),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.template.view,
          err => next(err, compiled)
        )
    ],
    (err, compiled) => {
      if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: compiled.template.hash,
          src: publishFileName
        },
        bundle: { hashKey: compiled.bundle.hash }
      });
    }
  );
};
