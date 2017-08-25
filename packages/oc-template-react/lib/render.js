const React = require("react");
const ReactDOMServer = require("react-dom/server");
const request = require("minimal-request");
const vm = require("vm");

const tryGetCached = require("./to-be-published/try-get-cached");

module.exports = (options, callback) => {
  const src = options.model.reactComponent.src;
  const key = options.model.reactComponent.key;
  const props = options.model.reactComponent.props;

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

        const context = { React };
        vm.runInNewContext(bundleString, context);
        const App = context.oc.reactComponents[key];
        cb(null, App);
      }
    );
  };

  tryGetCached("bundle", key, getBundleFromS3, (err, App) => {
    try {
      const reactHtml = ReactDOMServer.renderToString(
        React.createElement(App, props)
      );
      const html = options.template(
        Object.assign({}, options.model, {
          __html: reactHtml
        })
      );
      return callback(null, html);
    } catch (error) {
      return callback(error);
    }
  });
};
