const packageJson = require('../package.json');

module.exports = () => ({
  type: packageJson.info.type,
  version: packageJson.version,
  dependencies: packageJson.dependencies
});
