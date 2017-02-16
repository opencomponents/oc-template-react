/* jshint camelcase:false */
const webpack = require('webpack');

module.exports = function webpackConfigGenerator(options) {
  return {
    entry: options.viewPath,
    output: {
      path: '/build',
      filename: 'client.js',
      libraryTarget: 'var'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  'es2015'
                ]
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  };
};
