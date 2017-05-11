const render = require('../src/render');
const template = require('../__mocks__/template');

const model = { name: 'foo' };

describe('when invoking render()', () => {
  test('should return the correct templateString', (done) => {
    render({ template, model }, (_, res) => {
      expect(res).toMatchSnapshot();
      done();
    });
  });
});
