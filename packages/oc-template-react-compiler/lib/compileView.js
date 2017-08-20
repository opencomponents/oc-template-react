"use strict";

const async = require("async");
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const ocViewWrapper = require("oc-view-wrapper");
const path = require("path");
const strings = require("oc-templates-messages");
const compiler = require("./compiler");
const uuid = require("uuid/v4")();
const webpackConfigurator = require("./utils/webPackConfigurator");
var uglifycss = require("uglifycss");

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || "template.js";
  const componentPackage = options.componentPackage;
  const templateInfo = options.componentPackage.oc.files.template;

  // TODO move in utils
  function camelize(str) {
    return str
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/[^\w\s]/g, "")
      .replace(/ (.)/g, function($1) {
        return $1.toUpperCase();
      })
      .replace(/ /g, "");
  }

  const compile = (options, cb) => {
    const { getInfo } = require("../index");
    const externals = getInfo().externals.reduce((externals, dep) => {
      externals[dep.name] = dep.global;
      return externals;
    }, {});

    const componentName = `oc__${camelize(options.componentPackage.name)}`;
    const config = webpackConfigurator({
      confTarget: "view",
      viewPath,
      externals,
      componentName,
      publishFileName
    });
    compiler(config, (err, memoryFs) => {
      const bundle = memoryFs.readFileSync(
        `/build/${config.output.filename}`,
        "UTF8"
      );

      if (err) {
        return cb(err);
      }

      const bundleHash = hashBuilder.fromString(bundle);
      const bundleName = `${componentName}-${bundleHash}.js`;

      const bundleDir = "_js/";
      const bundlePath = path.join(publishPath, bundleDir, bundleName);
      fs.outputFileSync(bundlePath, bundle);
      let css = null;
      let cssName;
      let cssDir;
      let cssPath;

      if (memoryFs.data.build["main.css"]) {
        css = memoryFs.readFileSync(`/build/main.css`, "UTF8");
        // TODO: get webpack-hash on compilation
        const cssHash = hashBuilder.fromString(css);
        cssName = `${componentName}-${cssHash}.css`;
        cssDir = "_css/";
        cssPath = path.join(publishPath, cssDir, cssName);
        fs.outputFileSync(cssPath, uglifycss.processString(css));
      }

      const cssLink = css
        ? `<link rel="stylesheet" href="\${model.staticPath}${cssDir}${cssName}">`
        : "";

      const ssrMethod = templateInfo.ssr || "renderToString";
      const script =
        ssrMethod === "renderToString"
          ? `
        <script>
          (function(){
            oc.require(['${componentName}', 'default'], '\${model.staticPath}${bundleDir}${bundleName}', function(App){
              var targetNode = document.getElementById("${uuid}");
              targetNode.setAttribute("id","");
              ReactDOM.render(
                React.createElement(App, \${JSON.stringify(model)}),
                targetNode
              );
            });
          }())
        </script>`
          : "";

      const templateString = `function(model){
        return \`<div id="${uuid}">\${ model.html ? model.html : '' }</div>
          ${cssLink}
          ${script}
        \`;
      }`;

      const hash = hashBuilder.fromString(bundle);
      const view = ocViewWrapper(hash, templateString);
      return cb(null, { view, hash });
    });
  };

  async.waterfall(
    [
      next =>
        compile({ viewPath, componentPackage }, (err, viewContent) =>
          next(err ? "not found" : null, viewContent)
        ),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.view,
          err => next(err, compiled)
        )
    ],
    (err, compiled) => {
      if (err === "not found") {
        return callback(strings.errors.viewNotFound(viewFileName));
      } else if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        type: options.componentPackage.oc.files.template.type,
        hashKey: compiled.hash,
        src: publishFileName
      });
    }
  );
};
