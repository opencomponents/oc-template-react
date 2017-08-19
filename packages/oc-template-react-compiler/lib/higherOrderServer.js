import React from "react";
import ReactDOMServer from "react-dom/server";
import { data as dataProvider } from "/Users/nbalestra/OT/playground/oc-registry/react/server.js";
import App from "/Users/nbalestra/OT/playground/oc-registry/react/app.js";

export const data = (context, callback) => {
  dataProvider(context, (error, model) => {
    const extendedModel = Object.assign({}, model, {
      html: ReactDOMServer.renderToString(React.createElement(App, model))
    });
    return callback(null, extendedModel);
  });
};
