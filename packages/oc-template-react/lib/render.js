const PropTypes = require("prop-types");
const React = require("react");
const ReactDOM = require("react-dom");
const ReactDOMServer = require("react-dom/server");
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
      globals: {
        React,
        ReactDOM,
        PropTypes
      },
      extractor
    });

    tryGetCached("reactComponent", key, getJsFromUrl, (err, CachedApp) => {
      if (err) return callback(err);
      try {
        const reactHtml = ReactDOMServer.renderToString(
          React.createElement(CachedApp, props)
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
