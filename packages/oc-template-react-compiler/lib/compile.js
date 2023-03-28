'use strict';

const createCompile = require('oc-generic-template-compiler').createCompile;
const compileStatics = require('oc-statics-compiler');
const getInfo = require('oc-template-typescript-react').getInfo;

const compileServer = require('./compileServer');
const compileView = require('./compileView');
const verifyTypeScriptSetup = require('./verifyConfig');

const compiler = createCompile({
  compileServer,
  compileStatics,
  compileView,
  getInfo
});

const hasTsExtension = (file) => !!file.match(/\.tsx?$/);

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
module.exports = function compile(options, callback) {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const serverFileName = options.componentPackage.oc.files.data;
  const usingTypescript = hasTsExtension(viewFileName) || hasTsExtension(serverFileName);

  if (usingTypescript) {
    verifyTypeScriptSetup(options.componentPath);
  }

  return compiler(options, callback);
};
