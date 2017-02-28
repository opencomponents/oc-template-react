const render = require('./render');
const template = require('../__mocks__/template');

const model = { name: 'foo' };

describe('render method', () => {
  describe('when invoking the method', () => {
    test('should return the correct templateString', (done) => {
      render({ template, model }, (_, res) => {
        expect(res).toMatchSnapshot();
        done();
      });
    });
  });
});
