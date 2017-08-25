const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const externalDependenciesHandlers = require("oc-external-dependencies-handler");
const path = require("path");
const webpack = require("webpack");

module.exports = function webpackConfigGenerator(options) {
  const buildPath = options.buildPath || "/build";
  const localIdentName = "oc__[path][name]-[ext]__[local]__[hash:base64:5]";

  const cssLoader = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            modules: true,
            localIdentName
          }
        }
      ]
    })
  };

  if (options.confTarget === "view") {
    return {
      entry: options.viewPath,
      output: {
        path: buildPath,
        filename: options.publishFileName
      },
      externals: options.externals,
      module: {
        rules: [
          cssLoader,
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
                  ),
                  plugins: ["babel-plugin-transform-object-rest-spread"].map(
                    require.resolve
                  )
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "[name].css",
          allChunks: true
        }),
        // TODO: enable plugins only when env = production (aka publish, not dev)
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new MinifyPlugin()
      ],
      resolve: {
        alias: {
          react: path.join(__dirname, "../../node_modules/react"),
          "react-dom": path.join(__dirname, "../../node_modules/react-dom")
        }
      }
    };
  } else {
    return {
      entry: options.serverPath,
      target: "node",
      output: {
        path: buildPath,
        filename: options.publishFileName,
        libraryTarget: "commonjs2"
      },
      externals: externalDependenciesHandlers(options.dependencies),
      module: {
        rules: [
          cssLoader,
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
                  ],
                  plugins: ["babel-plugin-transform-object-rest-spread"].map(
                    require.resolve
                  )
                }
              }
            ]
          }
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: "[name].css",
          allChunks: true
        }),
        // TODO: enable plugins only when env = production (aka publish, not dev)
        new webpack.DefinePlugin({
          "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new MinifyPlugin()
      ],
      logger: options.logger || console,
      stats: options.stats
    };
  }
};
