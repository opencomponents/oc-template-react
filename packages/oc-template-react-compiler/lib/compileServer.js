"use strict";

const async = require("async");
const compiler = require("oc-webpack").compiler;
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const MemoryFS = require("memory-fs");
const path = require("path");
const reactComponentWrapper = require("oc-react-component-wrapper");

const webpackConfigurator = require("./to-abstract-base-template-utils/webpackConfigurator");

module.exports = (options, callback) => {
  const serverFileName = options.componentPackage.oc.files.data;
  let serverPath = path.join(options.componentPath, serverFileName);
  if (process.platform === "win32") {
    serverPath = serverPath.split("\\").join("\\\\");
  }
  const publishFileName = options.publishFileName || "server.js";
  const publishPath = options.publishPath;
  const stats = options.verbose ? "verbose" : "errors-only";
  const dependencies = options.componentPackage.dependencies || {};
  const componentName = options.componentPackage.name;
  const componentVersion = options.componentPackage.version;
  const production = options.production;

  const higherOrderServerContent = `
    import { data as dataProvider } from '${serverPath}';
    export const data = (context, callback) => {
      dataProvider(context, (error, model) => {
        if (error) {
          return callback(error);
        }
        const props = Object.assign({}, model, {
          _staticPath: context.staticPath,
          _baseUrl: context.baseUrl,
          _componentName: "${componentName}",
          _componentVersion: "${componentVersion}"
        });
        const srcPath = (context.env && context.env.name === "local") ? context.staticPath : "https:" + context.staticPath ;
        return callback(null, Object.assign({}, {
          reactComponent: {
            key: "${options.compiledViewInfo.bundle.hashKey}",
            src: srcPath + "react-component.js",
            props
          }
        }));
      });
    }
  `;

  const higherOrderServerName = "higherOrderServer.js";
  const higherOrderServerPath = path.join(
    publishPath,
    "temp",
    higherOrderServerName
  );
  fs.outputFileSync(higherOrderServerPath, higherOrderServerContent);

  const config = webpackConfigurator({
    confTarget: "server",
    serverPath: higherOrderServerPath,
    publishFileName,
    dependencies,
    stats,
    production
  });

  async.waterfall(
    [
      next => compiler(config, next),
      (data, next) => fs.ensureDir(publishPath, err => next(err, data)),
      (data, next) => {
        const memoryFs = new MemoryFS(data);
        const compiledServer = memoryFs.readFileSync(
          `/build/${config.output.filename}`,
          "UTF8"
        );
        fs.removeSync(higherOrderServerPath);
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
