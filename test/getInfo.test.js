const getInfo = require('../src/getInfo');

describe('when invoking getInfo()', () => {
  const info = getInfo();

  test('should return the correct version', () => {
    expect(info.version).toBeDefined();
  });
  test('should return the correct template type', () => {
    expect(info.type).toBe('oc-template-react');
  });
  test('should return the list of dependencies', () => {
    expect(info.dependencies).toMatchSnapshot();
  });
  test('should return the list of dependencies', () => {
    expect(info.externals).toMatchSnapshot();
  });
});
