const vm = require("vm");

module.exports = (templateString, key) => {
  const context = {};
  vm.runInNewContext(templateString, context);
  return context.oc.components[key];
};
