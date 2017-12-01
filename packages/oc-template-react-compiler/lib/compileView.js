"use strict";

const async = require("async");
const compiler = require("oc-webpack").compiler;
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const MemoryFS = require("memory-fs");
const minifyFile = require("oc-minify-file");
const ocViewWrapper = require("oc-view-wrapper");
const path = require("path");
const reactComponentWrapper = require("oc-react-component-wrapper");
const strings = require("oc-templates-messages");

const webpackConfigurator = require("./to-abstract-base-template-utils/webpackConfigurator");
const fontFamilyUnicodeParser = require("./to-abstract-base-template-utils/font-family-unicode-parser");

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || "template.js";
  const componentPackage = options.componentPackage;
  const { getInfo } = require("../index");
  const externals = getInfo().externals;
  const production = options.production;

  const higherOrderViewContent = `
    import PropTypes from 'prop-types';
    import React from 'react';
    import View from '${viewPath}';
    
    class OCProvider extends React.Component {
      getChildContext() {
        const getData = (parameters, cb) => {
          return window.oc.getData({
            name: this.props._componentName,
            version: this.props._componentVersion,
            baseUrl: this.props._baseUrl,
            parameters
          }, cb);
        };
        const getSetting = setting => {
          const settingHash = {
            name: this.props._componentName,
            version: this.props._componentName,
            baseUrl: this.props._baseUrl,
            staticPath: this.props._staticPath
          };
          return settingHash[setting];
        };
        return { getData, getSetting };
      }
    
      render() {
        const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = this.props;        
        return (
          <View {...rest} />
        );
      }
    }
    
    OCProvider.childContextTypes = {
      getData: PropTypes.func,
      getSetting: PropTypes.func
    };
    export default OCProvider
  `;

  const higherOrderViewName = "higherOrderView.js";
  const higherOrderViewPath = path.join(
    publishPath,
    "temp",
    higherOrderViewName
  );
  fs.outputFileSync(higherOrderViewPath, higherOrderViewContent);

  const compile = (options, cb) => {
    const config = webpackConfigurator({
      confTarget: "view",
      viewPath: higherOrderViewPath,
      externals: externals.reduce((externals, dep) => {
        externals[dep.name] = dep.global;
        return externals;
      }, {}),
      publishFileName,
      production
    });
    compiler(config, (err, data) => {
      if (err) {
        return cb(err);
      }

      const memoryFs = new MemoryFS(data);
      const bundle = memoryFs.readFileSync(
        `/build/${config.output.filename}`,
        "UTF8"
      );

      const bundleHash = hashBuilder.fromString(bundle);
      const bundleName = "react-component";
      const bundlePath = path.join(publishPath, `${bundleName}.js`);
      const wrappedBundle = reactComponentWrapper(bundleHash, bundle);
      fs.outputFileSync(bundlePath, wrappedBundle);

      let css = null;
      if (data.build["main.css"]) {
        // This is an awesome hack by KimTaro that will blow your mind.
        // Remove it once this get merged: https://github.com/webpack-contrib/css-loader/pull/523
        css = fontFamilyUnicodeParser(
          memoryFs.readFileSync(`/build/main.css`, "UTF8")
        );
        if (production) {
          css = minifyFile(".css", css);
        }
        const cssPath = path.join(publishPath, `styles.css`);
        fs.outputFileSync(cssPath, css);
      }

      const reactRoot = `oc-reactRoot-${componentPackage.name}`;
      const templateString = `function(model){
        return \`<div id="${reactRoot}" class="${
        reactRoot
      }" >\${ model.__html ? model.__html : '' }</div>
          <style>${css}</style>
          <script>
            window.oc = window.oc || {};
            oc.cmd = oc.cmd || [];
            oc.cmd.push(function(oc){
              oc.requireSeries(${JSON.stringify(externals)}, function(){
                oc.require(
                  ['oc', 'reactComponents', '${bundleHash}'],
                  '\${model.reactComponent.props._staticPath}${bundleName}.js',
                  function(ReactComponent){
                    var targetNode = document.getElementById("${reactRoot}");
                    targetNode.setAttribute("id","");
                    ReactDOM.render(React.createElement(ReactComponent, \${JSON.stringify(model.reactComponent.props)}),targetNode);
                  }
                );
              });
            });
          </script>
        \`;
      }`;

      const templateStringCompressed = production
        ? templateString.replace(/\s+/g, " ")
        : templateString;
      const hash = hashBuilder.fromString(templateStringCompressed);
      const view = ocViewWrapper(hash, templateStringCompressed);
      return cb(null, {
        template: { view, hash },
        bundle: { hash: bundleHash }
      });
    });
  };

  async.waterfall(
    [
      next => compile({ viewPath, componentPackage }, next),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) => {
        fs.removeSync(higherOrderViewPath);
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.template.view,
          err => next(err, compiled)
        );
      }
    ],
    (err, compiled) => {
      if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: compiled.template.hash,
          src: publishFileName
        },
        bundle: { hashKey: compiled.bundle.hash }
      });
    }
  );
};
