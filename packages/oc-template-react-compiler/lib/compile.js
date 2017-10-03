"use strict";

const createCompile = require("oc-generic-template-compiler").createCompile;
const compileStatics = require("oc-statics-compiler");
const getInfo = require("oc-template-react").getInfo;

const compileServer = require("./compileServer");
const compileView = require("./compileView");

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
// production
module.exports = createCompile({
  compileServer,
  compileStatics,
  compileView,
  getInfo
});
