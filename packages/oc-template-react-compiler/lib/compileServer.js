"use strict";

const async = require("async");
const compiler = require("./compiler");
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

  const ssrMethod = originalTemplateInfo.ssr || "renderToString";

  const higherOrderServerContent = `
    import React from 'react';
    import ReactDOMServer from 'react-dom/server';
    import { data as dataProvider } from '${serverPath}';
    import App from '${viewPath}';

    export const data = (context, callback) => {
      dataProvider(context, (error, model) => {
        const extendedModel = Object.assign({}, model, {
          html: ReactDOMServer.${ssrMethod}(React.createElement(App, model)),
          staticPath: context.staticPath
        })
        return callback(null, extendedModel)
      })
    }
  `;

  const higherOrderServerName = "higherOrderServer.js";
  const higherOrderServerPath = path.join(__dirname, higherOrderServerName);
  fs.outputFileSync(higherOrderServerPath, higherOrderServerContent);

  const config = webpackConfigurator({
    confTarget: "server",
    serverPath: higherOrderServerPath,
    publishFileName,
    stats
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (memoryFs, next) => {
        const compiledServer = memoryFs.readFileSync(
          `/build/${config.output.filename}`,
          "UTF8"
        );
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
        );
      }
    ],
    callback
  );
};
