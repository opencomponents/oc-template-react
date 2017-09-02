const fetch = require("isomorphic-fetch");
const React = require("react");
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
        console,
        clearTimeout,
        setTimeout,
        Promise,
        fetch,
        window: {}
      },
      extractor
    });

    tryGetCached("reactComponent", key, getJsFromUrl, (err, CachedApp) => {
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
