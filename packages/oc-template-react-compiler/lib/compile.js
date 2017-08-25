"use strict";

const _ = require("lodash");
const async = require("async");
const compileServer = require("./compileServer");
const compileStatics = require("./compileStatics");
const compileView = require("./compileView");
const fs = require("fs-extra");
const getInfo = require("oc-template-react").getInfo;
const getUnixUtcTimestamp = require("oc-get-unix-utc-timestamp");
const path = require("path");

// OPTIONS
// =======
// componentPath
// componentPackage,
// logger,
// minify
// ocPackage
// publishPath
// verbose,
// watch,
module.exports = (options, callback) => {
  options.componentPackage = _.cloneDeep(options.componentPackage);
  const componentPackage = options.componentPackage;
  const ocPackage = options.ocPackage;

  async.waterfall(
    [
      // Compile view
      function(cb) {
        // compiledViewInfo, bundleInfo
        compileView(options, (error, compiledInfo) => {
          if (error) {
            return cb(error);
          }
          // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
          // const originalTemplateInfo = componentPackage.oc.files.template;
          componentPackage.oc.files.template = compiledInfo.template;
          delete componentPackage.oc.files.client;
          cb(error, { componentPackage, compiledInfo });
        });
      },
      // Compile dataProvider
      function({ componentPackage, compiledInfo }, cb) {
        if (!componentPackage.oc.files.data) {
          return cb(null, componentPackage);
        }
        compileServer(
          { options, compiledInfo },
          (error, compiledServerInfo) => {
            if (error) {
              return cb(error);
            }
            // USE COMPILATION INFO TO MASSAGE COMPONENT'S PACKAGE
            componentPackage.oc.files.dataProvider = compiledServerInfo;
            delete componentPackage.oc.files.data;
            cb(error, componentPackage);
          }
        );
      },
      // Compile package.json
      function(componentPackage, cb) {
        componentPackage.oc.files.template.version = getInfo().version;
        componentPackage.oc.version = ocPackage.version;
        componentPackage.oc.packaged = true;
        componentPackage.oc.date = getUnixUtcTimestamp();
        if (!componentPackage.oc.files.static) {
          componentPackage.oc.files.static = [];
        }
        if (!_.isArray(componentPackage.oc.files.static)) {
          componentPackage.oc.files.static = [componentPackage.oc.files.static];
        }
        fs.writeJson(
          path.join(options.publishPath, "package.json"),
          componentPackage,
          error => {
            cb(error, componentPackage);
          }
        );
      },
      // Compile statics
      function(componentPackage, cb) {
        compileStatics(options, error => cb(error, componentPackage));
      }
    ],
    callback
  );
};
