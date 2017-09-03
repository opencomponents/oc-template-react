import React from "react";
import Loadable from "./Loadable";
import sha1 from "./sha1";

const Loading = () => <div>Loading...</div>;
const wrapHTMLComponent = html =>
  class Something extends React.Component {
    componentDidMount() {
      const newContent = document.createElement("div");
      newContent.innerHTML = html;
      newContent.querySelectorAll("script").forEach(oldScript => {
        // this is to hydrate the ssr scripts, we need to orchestrate this better without eval
        // this is just to show main idea - skyscanner has a lot going on in this direction already
        eval.call(window, oldScript.textContent);
      });
    }
    // we could also remove all the scripts from the html we set here.
    render() {
      return <div {...this.props} dangerouslySetInnerHTML={{ __html: html }} />;
    }
  };

const inserCSSComponent = (Component, staticPath) => props =>
  <div>
    <link rel="stylesheet" href={`${staticPath}styles.css`} />
    <Component {...props} />
  </div>;

module.exports = ({ baseUrl, ...globalOptions }) => {
  return {
    getComponent: params => {
      const { name, version = "*", ...opts } = params;
      const headers = { Accept: "application/vnd.oc.unrendered+json" };
      const componentUrl = `${baseUrl}${name}/${version}`;
      const requestBundleHash = sha1(`${JSON.stringify(componentUrl)}`);

      return Loadable(
        Object.assign(
          {
            loader: () => {
              oc = oc || {};
              oc.requestedComponents = oc.requestedComponents || {};
              if (oc.requestedComponents[requestBundleHash]) {
                return oc.requestedComponents[requestBundleHash];
              }
              return (oc.requestedComponents[
                requestBundleHash
              ] = fetch(componentUrl, { headers })
                .then(resp => resp.json())
                .then(({ data, template }) => {
                  if (data.reactComponent) {
                    oc.reactComponents = oc.reactComponents || {};
                    if (oc.reactComponents[data.reactComponent.key]) {
                      return oc.reactComponents[data.reactComponent.key];
                    }
                    return fetch(data.reactComponent.src)
                      .then(resp => resp.text())
                      .then(jsBundle =>
                        inserCSSComponent(
                          eval.call(this, jsBundle),
                          data.reactComponent.props.staticPath
                        )
                      );
                  }
                  return fetch(componentUrl)
                    .then(resp => resp.json())
                    .then(json => wrapHTMLComponent(json.html));
                }));
            },
            loading: Loading
          },
          globalOptions,
          opts
        )
      );
    }
  };
};
