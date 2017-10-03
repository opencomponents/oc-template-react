"use strict";

module.exports = (hash, content, nameSpace) => {
  nameSpace = nameSpace || "oc";
  return `var ${nameSpace}=${nameSpace}||{};${nameSpace}.reactComponents=${nameSpace}.reactComponents||{};${nameSpace}.reactComponents['${hash}']=${nameSpace}.reactComponents['${hash}']||(function(){var module = ${content}; return module.default}())`;
};
