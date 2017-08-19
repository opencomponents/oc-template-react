"use strict";

const async = require("async");
const compiler = require("oc-webpack").compiler;
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const path = require("path");
// const webpackConfigurator = require('oc-webpack').configurator;
const webpackConfigurator = require("./utils/webPackConfigurator");

module.exports = ({ options, originalTemplateInfo }, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const viewPath = path.join(options.componentPath, originalTemplateInfo.src);
  const publishFileName = options.publishFileName || "server.js";
  const publishPath = options.publishPath;
  const stats = options.verbose ? "verbose" : "errors-only";
  const dependencies = options.componentPackage.dependencies || {};

  const higherOrderServerContent = `
    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import { data as dataProvider } from '${serverPath}';
    import App from '${viewPath}';

    export const data = (context, callback) => {
      dataProvider(context, (error, model) => {
        const extendedModel = Object.assign({}, model, {
          html: ReactDOMServer.renderToString(React.createElement(App, model))
        })
        return callback(null, extendedModel)
      })
    }
  `;

  const higherOrderServerName = "higherOrderServer.js";
  const higherOrderServerPath = path.join(__dirname, higherOrderServerName);
  fs.outputFileSync(higherOrderServerPath, higherOrderServerContent);

  const config = webpackConfigurator("server", {
    serverPath: higherOrderServerPath,
    publishFileName,
    // dependencies: {},
    stats
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (compiledServer, next) =>
        fs.ensureDir(publishPath, err => next(err, compiledServer)),
      (compiledServer, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiledServer,
          err =>
            next(
              err,
              err
                ? null
                : {
                    type: "node.js",
                    hashKey: hashBuilder.fromString(compiledServer),
                    src: publishFileName
                  }
            )
        )
    ],
    callback
  );
};
