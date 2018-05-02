"use strict";

const createExcludeRegex = buildIncludes =>
  new RegExp(`node_modules\/(?!(${buildIncludes.join("|")}))`);

module.exports = createExcludeRegex;
