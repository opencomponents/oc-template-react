"use strict";

// Example: Each index needs to be a valid Webpack Rule.
// Each loader needs to be included in your package.json as a devDependency

module.exports = [
  // {
  // test: /\.css$/,
  // loader: ExtractTextPlugin.extract({
  //   use: [
  //     {
  //       loader: require.resolve("css-loader"),
  //       options: {
  //         importLoaders: 1,
  //         modules: true,
  //         localIdentName: "[local]__[hash:base64:8]",
  //         camelCase: true
  //       }
  //     },
  //     {
  //       loader: require.resolve("postcss-loader"),
  //       options: {
  //         ident: "postcss",
  //         plugins: [
  //           require("postcss-import"),
  //           require("postcss-extend"),
  //           require("postcss-icss-values"),
  //           require("autoprefixer")
  //         ]
  //       }
  //     }
  //   ]
  // })
  // }
];