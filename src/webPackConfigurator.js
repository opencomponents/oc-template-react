/* jshint camelcase:false */
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

module.exports = function webpackConfigGenerator(viewPath) {
  return {
    entry: viewPath,
    output: {
      path: '/build',
      filename: 'client.js'
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
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
                  'babel-preset-es2015',
                  'babel-preset-react'
                ].map(require.resolve)
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new BabiliPlugin() // ! needed for pure bundle minification
    ],
    resolveLoader: {
      modules: ['node_modules', path.resolve(__dirname, '../node_modules')]
    }
  };
};
