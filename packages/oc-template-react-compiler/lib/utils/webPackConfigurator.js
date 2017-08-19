/* eslint-disable camelcase, dot-notation */

// const webpack = require('webpack');
// const BabiliPlugin = require('babili-webpack-plugin');
// const path = require('path');
// const packageJson = require('../package.json');

module.exports = function webpackConfigGenerator(options) {
  return {
    entry: options.viewPath,
    output: {
      path: "/build",
      filename: "client.js"
    },
    externals: options.externals || {},
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory: false,
                presets: ["babel-preset-es2015", "babel-preset-react"].map(
                  require.resolve
                )
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   'process.env.NODE_ENV': JSON.stringify('production')
      // }),
      // new BabiliPlugin() // ! needed for pure bundle minification
    ]
    // resolveLoader: {
    //   modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
    // }
  };
};
