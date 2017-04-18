'use strict';

const path = require('path');
var jsdom = require("jsdom");
const vm = require('vm');
const { compile, getInfo } = require('../src/index.js');
const viewPath = path.join(__dirname, '..', 'blueprint/src/app.js');
const externals = getInfo().externals;

describe('A bundled app', () => {
  test('should comprise a div and a script', () => {
    compile({ viewPath }, (err, bundle) => {
      const template = 'var tpl = ' + bundle
      const context = {}
      vm.runInNewContext(template, context)
      const component = context.tpl({name: 'Nick'})

      jsdom.defaultDocumentFeatures = { 
        FetchExternalResources   : ['script'],
        ProcessExternalResources : ['script']
      };
      
      const htmlDoc = '<html>' +
        '<body>' +
        externals.map(dep => `<script src="${dep.url}"></script>`) +
        component +
        '</body>' +
        '</html>';

      const document = jsdom.jsdom(htmlDoc);
      const window = document.defaultView;
      const renderedH1 = window.document.getElementsByTagName('h1');
      const scriptTags = window.document.getElementsByTagName('script')
      const rootElement = window.document.getElementsByTagName('div')[0];
        
      expect(rootElement.id.length).toBeGreaterThan(10)
      expect(scriptTags.length).toBe(3)

      test('should correctly render as a react element', done => {
        expect(window.React).tobeundefined
        expect(window.ReactDOM).tobeundefined
        expect(renderedH1.length).toBe(0)

        window.addEventListener('load', () => {
          expect(renderedH1.length).toBe(1)
          expect(renderedH1[0].textContent).toBe('Hello Nick!')
          done();
        });    
      });
    });
  });
});
