/* eslint-disable dot-notation */

const packageJson = require('../package.json');

module.exports = () => ({
  type: packageJson.name,
  version: packageJson.version,
  externals: [
    packageJson.externals['react'],
    packageJson.externals['react-dom']
  ]
});
