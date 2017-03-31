/* eslint no-useless-escape: "off", max-len: "off", quotes: "off" */
const compile = require('./compile');
const webPackConfiguration = require('./webPackConfigurator');
const path = require('path');

describe('compile method', () => {
  describe('when invoking the webPackConfiguration with a viewPath', () => {
    const config = webPackConfiguration('path/to/app.js');
    config.module.rules[0].use[0].options.presets = [];
    config.resolveLoader.modules = [];
    test('should correctly return a webpack configuration', () => {
      expect(config).toMatchSnapshot();
    });
  });

  describe('when invoking the compile method', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

    test('should correctly return a bundled template', (done) => {
      compile({ viewPath: path.resolve(__dirname, '../__mocks__/app.js') }, (err, res) => {
        expect(res).toMatch('function(model) {return \'<div id=\"');
        expect(res).toMatch("var reactApp = (function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.i=function(d){return d},b.d=function(d,e,f){b.o(d,e)||Object.defineProperty(d,e,{configurable:!1,enumerable:!0,get:f})},b.n=function(d){var e=d&&d.__esModule?function(){return d[\\\"default\\\"]}:function(){return d};return b.d(e,\\\"a\\\",e),e},b.o=function(d,e){return Object.prototype.hasOwnProperty.call(d,e)},b.p=\\\"\\\",b(b.s=2)})([function(a,b,c){\\\"use strict\\\";Object.defineProperty(b,\\\"__esModule\\\",{value:!0});var e=c(1),f=function(h){return h&&h.__esModule?h:{default:h}}(e);b.default=function(i){return f.default.createElement(\\\"div\\\",null,\\\"Hello \\\",i.name,\\\"!\\\")}},function(a){a.exports=React},function(a,b,c){\\\"use strict\\\";var d=c(0).default;a.exports=function(e){return React.createElement(d,e,null)}}]);;ReactDOM.render(reactApp(\'+ JSON.stringify(model) + \'), targetNode);</script>\'};");
        done();
      });
    });
  });
});
