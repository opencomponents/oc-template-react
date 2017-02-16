const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const webpackConfigurator = require('./webPackConfigurator');

const memoryFs = new MemoryFS();

module.exports = (options, callback) => {
  const config = webpackConfigurator(options);
  const compiler = webpack(config);
  compiler.outputFileSystem = memoryFs;

  compiler.run((err) => {
    if (err) {
      throw err;
    }

    const clientContentBundled = memoryFs.readFileSync('/build/client.js', 'UTF8');
    callback(`${clientContentBundled}`);
  });
};
