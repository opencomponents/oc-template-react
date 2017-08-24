"use strict";

const async = require("async");
const compiler = require("./compiler");
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const path = require("path");

// TODO:
// - Abstract further the original webpack configurator in oc-webpack to support dev/publish scenario
// - oc-compile-server should be able to do 100% of what we are doing here, if not extend it to be used here
// const webpackConfigurator = require('oc-webpack').configurator && oc-server-compile
const { webpackConfigurator } = require("./utils");

module.exports = ({ options, originalTemplateInfo }, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const viewPath = path.join(options.componentPath, originalTemplateInfo.src);
  const publishFileName = options.publishFileName || "server.js";
  const publishPath = options.publishPath;
  const stats = options.verbose ? "verbose" : "errors-only";
  const dependencies = options.componentPackage.dependencies || {};

  const higherOrderServerContent = `
    import { data as dataProvider } from '${serverPath}';
    export const data = (context, callback) => {
      dataProvider(context, (error, model) => {
        return callback(null, Object.assign({}, model, {
          staticPath: context.staticPath,
          __reactApp: {
            key: "03e94393f65f472808c5f358d4f372e377de8765",
            src: context.staticPath + "_js/oc__myReactComponent-03e94393f65f472808c5f358d4f372e377de8765.js",
            options: {
              hydration: true,
              client: "oc-client"
            }
          }
        }));
      });
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
        fs.removeSync(higherOrderServerPath);
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
