"use strict";

const _ = require("lodash");
const async = require("async");
const fs = require("fs-extra");
const minifyFile = require("oc-minify-file");
const nodeDir = require("node-dir");
const path = require("path");
const strings = require("oc-templates-messages");

module.exports = (options, callback) => {
  const staticDirectories = options.componentPackage.oc.files.static || [];

  if (staticDirectories.length === 0) {
    return callback(null, "ok");
  }

  async.eachSeries(
    staticDirectories,
    copyDirectory.bind(null, options),
    error => {
      if (error) {
        return callback(error);
      }
      callback(null, "ok");
    }
  );
};

function copyDirectory(options, directoryName, callback) {
  const directoryPath = path.join(options.componentPath, directoryName);
  const directoryExists = fs.existsSync(directoryPath);
  const isDirectory =
    directoryExists && fs.lstatSync(directoryPath).isDirectory();

  if (!directoryExists) {
    return callback(strings.errors.folderNotFound(directoryPath));
  }
  if (!isDirectory) {
    return callback(strings.errors.folderNotValid(directoryPath));
  }

  nodeDir.paths(directoryPath, (err, res) => {
    _.forEach(res.files, filePath => {
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      const fileRelativePath = path.relative(
        directoryPath,
        path.dirname(filePath)
      );
      const fileDestinationPath = path.join(
        options.publishPath,
        directoryName,
        fileRelativePath
      );
      fs.ensureDirSync(fileDestinationPath);
      const fileDestination = path.join(fileDestinationPath, fileName);
      if (
        options.minify &&
        options.componentPackage.minify !== false &&
        (fileExtension === ".js" || fileExtension === ".css")
      ) {
        const fileContent = fs.readFileSync(filePath).toString();
        const minifiedContent = minifyFile(fileExtension, fileContent);
        fs.writeFileSync(fileDestination, minifiedContent);
      } else {
        fs.copySync(filePath, fileDestination);
      }
    });
    callback(null, "ok");
  });
}
