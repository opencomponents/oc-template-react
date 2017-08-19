/* eslint-disable camelcase, dot-notation */

const webpack = require("webpack");
// const BabiliPlugin = require('babili-webpack-plugin');
const path = require("path");
// const packageJson = require('../package.json');

module.exports = function webpackConfigGenerator(target, options) {
  if (target === "view") {
    return {
      entry: options.viewPath,
      output: {
        library: options.componentName,
        path: "/build",
        filename: "client.js"
      },
      externals: options.externals,
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
  } else {
    return {
      entry: options.serverPath,
      target: "node",
      output: {
        path: "/build",
        filename: options.publishFileName,
        libraryTarget: "commonjs2"
      },
      // externals: externalDependenciesHandlers(options.dependencies),
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve("infinite-loop-loader")
              },
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory: false,
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
                    require.resolve("babel-preset-react")
                  ]
                }
              }
            ]
          }
        ]
      },
      plugins: [
        // new BabiliPlugin(),
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        })
      ],
      logger: options.logger || console,
      stats: options.stats,
      resolve: {
        alias: {
          react: path.join(__dirname, "../../node_modules/react"),
          "react-dom": path.join(__dirname, "../../node_modules/react-dom")
        }
      }
    };
  }
};
