"use strict";

const async = require("async");
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const path = require("path");

const compiler = require("./to-abstract-base-template-utils/compiler");
const webpackConfigurator = require("./to-abstract-base-template-utils/webpackConfigurator");
const reactComponentWrapper = require("./to-be-published/oc-react-component-wrapper");

module.exports = ({ options, compiledInfo }, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  const serverPath = path.join(options.componentPath, serverFileName);
  const publishFileName = options.publishFileName || "server.js";
  const publishPath = options.publishPath;
  const stats = options.verbose ? "verbose" : "errors-only";
  const dependencies = options.componentPackage.dependencies || {};
  const build = options.build;

  const higherOrderServerContent = `
    import { data as dataProvider } from '${serverPath}';
    export const data = (context, callback) => {
      dataProvider(context, (error, model) => {
        const props = Object.assign({}, model, {
          staticPath: context.staticPath,
        });
        return callback(null, Object.assign({}, {
          reactComponent: {
            key: "${compiledInfo.bundle.hashKey}",
            src: context.staticPath + "react-component.js",
            props
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
    dependencies,
    stats,
    build
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (memoryFs, next) => fs.ensureDir(publishPath, err => next(err, memoryFs)),
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
