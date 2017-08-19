"use strict";

const async = require("async");
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const ocViewWrapper = require("oc-view-wrapper");
const path = require("path");
const strings = require("oc-templates-messages");
// const uglifyJs = require('uglify-js');
const { compiler } = require("oc-webpack");
const uuid = require("uuid/v4")();
const webpackConfigurator = require("./utils/webPackConfigurator");
const jsStringEscape = require("js-string-escape");
const { renderToString } = require("react-dom/server");

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || "template.js";

  const compile = (options, cb) => {
    // Create a temporary entry file to require the react app from oc.files.template.src
    // exposing a function: viewModel => reactElement to be used for bundling with webpack
    const clientPath = path.resolve(__dirname, "_client.js");
    const clientContent = `
      var src = require('${options.viewPath}').default;
      module.exports = viewModel => React.createElement(src, viewModel, null)
    `;
    fs.outputFile(clientPath, clientContent, error => {
      if (error) {
        return cb(error);
      }
      const { getInfo } = require("../index");
      const externals = getInfo().externals.reduce((externals, dep) => {
        externals[dep.name] = dep.global;
        return externals;
      }, {});

      // Compile template
      const config = webpackConfigurator({ viewPath: clientPath, externals });
      compiler(config, (err, bundle) => {
        if (err) {
          return cb(err);
        }
        // Remove temporary entry file
        fs.remove(clientPath, error => {
          if (error) {
            return cb(error);
          }

          // Assemble templateString
          const templateString =
            "function(model) {" +
            "return '<div id=\"" +
            uuid +
            '"></div>' +
            "<script>" +
            'var targetNode = document.getElementById("' +
            uuid +
            '");' +
            'targetNode.setAttribute("id","");' +
            "var reactApp = " +
            jsStringEscape(bundle) +
            ";" +
            "ReactDOM.render(reactApp('+ JSON.stringify(model) + '), targetNode);" +
            "</script>'" +
            "};";

          const hash = hashBuilder.fromString(bundle);
          const view = ocViewWrapper(hash, templateString);

          return cb(null, { view, hash });
        });
      });
    });
  };

  async.waterfall(
    [
      next =>
        compile({ viewPath }, (err, viewContent) =>
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
