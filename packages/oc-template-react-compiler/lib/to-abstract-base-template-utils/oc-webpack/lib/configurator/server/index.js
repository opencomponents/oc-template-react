/*jshint camelcase:false */
"use strict";

const MinifyPlugin = require("babel-minify-webpack-plugin");
const externalDependenciesHandlers = require("oc-external-dependencies-handler");
const path = require("path");
const webpack = require("webpack");

module.exports = function webpackConfigGenerator(options) {
  const production =
    options.production !== undefined ? options.production : "true";

  const sourceMaps = !production;
  const devtool = sourceMaps ? "#source-map" : "";

  const jsLoaders = [
    {
      loader: require.resolve("babel-loader"),
      options: {
        cacheDirectory: true,
        retainLines: true,
        sourceMaps,
        sourceRoot: path.join(options.serverPath, ".."),
        babelrc: false,
        presets: [
          [
            require.resolve("babel-preset-env"),
            {
              modules: false,
              targets: {
                node: 6
              }
            }
          ],
          [
            require.resolve("babel-preset-react")
          ]
        ],
        plugins: [
          [require.resolve("babel-plugin-transform-object-rest-spread")]
        ]
      }
    }
  ];

  const plugins = [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      )
    })
  ];

  if (production) {
    jsLoaders.unshift({
      loader: require.resolve("infinite-loop-loader")
    });
    plugins.unshift(new MinifyPlugin());
  }

  return {
    mode: production ? "production" : "development",
    optimization: {
      // https://webpack.js.org/configuration/optimization/
      // Override production mode optimization for minification
      // As it currently breakes the build, still rely on babel-minify-webpack-plugin instead
      minimize: false
    },
    devtool,
    entry: options.serverPath,
    target: "node",
    output: {
      path: path.join(options.serverPath, "../build"),
      filename: options.publishFileName,
      libraryTarget: "commonjs2",
      devtoolModuleFilenameTemplate: "[absolute-resource-path]",
      devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    },
    externals: externalDependenciesHandlers(options.dependencies),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: jsLoaders
        }
      ]
    },
    plugins,
    logger: options.logger || console,
    stats: options.stats
  };
};
