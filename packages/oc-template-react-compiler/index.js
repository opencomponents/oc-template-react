"use strict";

const compile = require("./lib/compile");
const template = require("oc-template-react");

module.exports = {
  compile,
  getCompiledTemplate: template.getCompiledTemplate,
  getInfo: template.getInfo,
  render: template.render
};
