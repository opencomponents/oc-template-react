/* eslint strict: "off", quotes: "off", prefer-template: "off", no-useless-escape: "off", vars-on-top: "off" */
'use strict';

const MemoryFS = require('memory-fs');
const webpack = require('webpack');
const webpackConfigurator = require('./webPackConfigurator');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid/v4')();

const memoryFs = new MemoryFS();

module.exports = (options, callback) => {
  // create a temporary entry file to require react from oc.template.src
  const clientPath = path.resolve(__dirname, 'client.js');
  const clientContent = `
    import src from '${options.viewPath}';
    module.exports = mv => React.createElement(src, mv, null)
  `;
  fs.outputFileSync(clientPath, clientContent, 'UTF8');

  // set up in-memory bundling
  const config = webpackConfigurator(clientPath);
  const compiler = webpack(config);
  compiler.outputFileSystem = memoryFs;

  compiler.run((error, stats) => {
    let softError;

    // handleFatalError
    if (error) {
      return callback(error);
    }

    const info = stats.toJson();
    // handleSoftErrors
    if (stats.hasErrors()) {
      softError = info.errors.toString();
      return callback(softError);
    }

    console.log(stats.toString({
      chunks: false,
      colors: true,
      version: false,
      hash: false
    }));

    // delete temporary entry file
    fs.removeSync(clientPath);

    // read bundle from memory
    const bundle = memoryFs.readFileSync('/build/client.js', 'UTF8');
    const templateString = "function(model) {"
      + "return '<div id=\"" + uuid + "\"></div>"
      + "<script>"
      + "var targetNode = document.getElementById(\"" + uuid + "\");"
      + "targetNode.setAttribute(\"id\",\"\");"
      + 'var reactApp = ' + bundle.replace(/'/g, '\\\"') + ';'
      + "ReactDOM.render(reactApp(\'+ JSON.stringify(model) + \'), targetNode);"
      + "</script>'"
      + "};";

    return callback(templateString);
  });
};
