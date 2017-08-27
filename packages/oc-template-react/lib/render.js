const React = require("react");
const ReactDOMServer = require("react-dom/server");
const request = require("minimal-request");
const vm = require("vm");

const createPredicate = require("./to-be-published/get-js-from-url");
const tryGetCached = require("./to-be-published/try-get-cached");

module.exports = (options, callback) => {
  try {
    const url = options.model.reactComponent.src;
    const key = options.model.reactComponent.key;
    const props = options.model.reactComponent.props;
    const extractor = (key, context) => context.oc.reactComponents[key];
    const getJsFromUrl = createPredicate({
      key,
      url,
      globals: { React },
      extractor
    });
    tryGetCached("reactComponent", key, getJsFromUrl, (err, ReactComponent) => {
      try {
        const reactHtml = ReactDOMServer.renderToString(
          React.createElement(ReactComponent, props)
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
  } catch (err) {
    return callback(err);
  }
};
