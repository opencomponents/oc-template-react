const packageJson = require("../package.json");
const externals = Object.keys(packageJson.externals).map(
  dep => packageJson.externals[dep]
);

module.exports = () => ({
  type: packageJson.name,
  version: packageJson.version,
  externals
});
