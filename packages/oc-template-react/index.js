"use strict";

const {
  getCompiledTemplate,
  getInfo,
  render
} = require("oc-generic-template-renderer");

const packageJson = require("./package.json");
const info = getInfo(packageJson);

module.exports = {
  getCompiledTemplate,
  getInfo: () => info,
  render
};
