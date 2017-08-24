const React = require("react");
const ReactDOMServer = require("react-dom/server");
const tryGetCached = require("./try-get-cached");
const request = require("minimal-request");
const vm = require("vm");

// module.exports = (options, callback) => {
//   console.log(options)
//   try {
//     const html = options.template(options.model);
//     return callback(null, html);
//   } catch (error) {
//     return callback(error);
//   }
// };
module.exports = (options, callback) => {
  const { src, key, options: appOptions } = options.model.__reactApp;
  delete options.model.__reactApp;
  delete options.model.__html;
  const cleanModel = Object.assign({}, options.model);

  const getBundleFromS3 = cb => {
    request(
      {
        url: src,
        timeout: 5000
      },
      (err, bundleString) => {
        if (err) {
          return cb({
            status: err,
            response: {
              error: `request ${src} failed (${bundleString})`
            }
          });
        }

        cb(null, bundleString);
      }
    );
  };

  tryGetCached("bundle", key, getBundleFromS3, (err, bundleString) => {
    try {
      const context = { React };
      vm.runInNewContext(bundleString, context);
      const App = context["oc__myReactComponent"]; //TODO
      let reactRender = ReactDOMServer.renderToString;
      if (appOptions.rehydration === true) {
        reactRender = ReactDOMServer.renderToStaticMarkup;
      }
      const reactHtml = reactRender(
        React.createElement(App.default, cleanModel)
      );
      const props = cleanModel;
      const html = options.template({
        __html: reactHtml,
        props
      });
      return callback(null, html);
    } catch (error) {
      console.log(error);
      return callback(error);
    }
  });
};
