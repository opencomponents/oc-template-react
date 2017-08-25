"use strict";

const genericRenderer = require("oc-generic-template-renderer");

const render = require("./lib/render");
const packageJson = require("./package.json");

module.exports = {
  getCompiledTemplate: genericRenderer.getCompiledTemplate,
  getInfo: () => genericRenderer.getInfo(packageJson),
  render
};
