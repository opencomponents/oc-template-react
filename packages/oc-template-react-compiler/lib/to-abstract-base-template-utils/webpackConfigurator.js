"use strict";

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const externalDependenciesHandlers = require("oc-external-dependencies-handler");
const path = require("path");
const webpack = require("oc-webpack").webpack;

module.exports = function webpackConfigGenerator(options) {
  const buildPath = options.buildPath || "/build";
  const production = options.production;
  const localIdentName = !production
    ? "oc__[path][name]-[ext]__[local]__[hash:base64:8]"
    : "[local]__[hash:base64:8]";

  const cssLoader = {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      use: [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            modules: true,
            localIdentName,
            camelCase: true
          }
        },
        {
          loader: require.resolve("postcss-loader"),
          options: {
            ident: "postcss",
            plugins: [
              require("postcss-import"),
              require("postcss-extend"),
              require("postcss-icss-values"),
              require("autoprefixer")
            ]
          }
        }
      ]
    })
  };

  let plugins = [
    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: true,
      ignoreOrder: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      )
    })
  ];
  if (production) {
    plugins = plugins.concat(new MinifyPlugin());
  }

  const cacheDirectory = !production;

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
          exclude: /node_modules\/(?!(oc-template-react-compiler\/utils))/,
          use: [
            {
              loader: require.resolve("babel-loader"),
              options: {
                cacheDirectory,
                babelrc: false,
                presets: [
                  [
                    require.resolve("babel-preset-env"),
                    { modules: false, loose: true }
                  ],
                  [require.resolve("babel-preset-react")]
                ],
                plugins: [
                  [require.resolve("babel-plugin-transform-object-rest-spread")]
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
        "react-dom": path.join(__dirname, "../../node_modules/react-dom"),
        "prop-types": path.join(__dirname, "../../node_modules/prop-types")
      }
    }
  };
};
