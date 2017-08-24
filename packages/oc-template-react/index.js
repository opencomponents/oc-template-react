"use strict";

const {
  getCompiledTemplate,
  getInfo
} = require("oc-generic-template-renderer");
const render = require("./lib/render");

const packageJson = require("./package.json");
const info = getInfo(packageJson);

module.exports = {
  getCompiledTemplate,
  getInfo: () => info,
  render
};
