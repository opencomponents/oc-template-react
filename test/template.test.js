'use strict';

const path = require('path');
var jsdom = require("jsdom");
const vm = require('vm');
const { compile, getInfo, render, getCompiledTemplate } = require('../src/index.js');
const viewPath = path.join(__dirname, '..', 'blueprint/src/app.js');
const externals = getInfo().externals;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe('An packaged oc-template-react view', () => {
  test('should correctly render client side using external dependencies', done => {
    compile({ viewPath }, (err, bundle) => {
      const template = getCompiledTemplate('var oc = {components: {}}; oc.components[0] = ' + bundle, 0)      
      const model = {name: 'Beautiful Test'}

      render({model, template}, function(err, rendered) {
        jsdom.defaultDocumentFeatures = { 
          FetchExternalResources   : ['script'],
          ProcessExternalResources : ['script']
        };
        
        const htmlDoc = '<html>' +
          '<body>' +
          externals.map(dep => `<script src="${dep.url}"></script>`).join("") +
          rendered +
          '</body>' +
          '</html>';

        const document = jsdom.jsdom(htmlDoc);
        const window = document.defaultView;
        
        const scriptTags = window.document.getElementsByTagName('script')
        const rootElement = window.document.getElementsByTagName('div')[0];
        const renderedH1 = window.document.getElementsByTagName('h1');

        test('ddd', () => {
          expect(rootElement.id.length).toBeGreaterThan(10)
          expect(scriptTags.length).toBe(3)
          expect(renderedH1.length).toBe(0)
        })
        
        window.addEventListener('load', () => {
          expect(renderedH1.length).toBe(1)
          expect(renderedH1[0].textContent).toBe('Hello Beautiful Test!')
          done()
        });    
      })

      
    });
  });
});
