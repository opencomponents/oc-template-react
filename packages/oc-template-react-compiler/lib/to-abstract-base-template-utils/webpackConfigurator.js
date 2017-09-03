const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const externalDependenciesHandlers = require("oc-external-dependencies-handler");
const path = require("path");
const webpack = require("webpack");

module.exports = function webpackConfigGenerator(options) {
  const buildPath = options.buildPath || "/build";
  const build = options.build || "production";
  const localIdentName =
    build !== "production"
      ? "oc__[path][name]-[ext]__[local]__[hash:base64:8]"
      : "[local]__[hash:base64:8]";

  const cssLoader = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 2,
            modules: true,
            localIdentName
          }
        }
      ]
    })
  };

  let plugins = [
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(build)
    })
  ];
  if (build !== "development") {
    plugins = plugins.concat(new MinifyPlugin());
  }

  const cacheDirectory = build === "development";

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
                  cacheDirectory,
                  presets: ["babel-preset-es2015", "babel-preset-react"].map(
                    require.resolve
                  ),
                  plugins: [
                    [
                      require.resolve(
                        "babel-plugin-transform-object-rest-spread"
                      )
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      plugins,
      resolve: {
        alias: {
          react: path.join(__dirname, "../../node_modules/react"),
          "react-dom": path.join(__dirname, "../../node_modules/react-dom")
        }
      }
    };
  } else {
    let loaders = [];
    if (build !== "development") {
      loader = loaders.concat({
        loader: require.resolve("infinite-loop-loader")
      });
    }

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
            use: loaders.concat([
              {
                loader: require.resolve("babel-loader"),
                options: {
                  cacheDirectory,
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
                  plugins: [
                    [
                      require.resolve(
                        "babel-plugin-transform-object-rest-spread"
                      )
                    ]
                  ]
                }
              }
            ])
          }
        ]
      },
      plugins,
      logger: options.logger || console,
      stats: options.stats
    };
  }
};
