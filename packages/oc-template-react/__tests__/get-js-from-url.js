const getJSFromUrl = require("../lib/to-be-published/get-js-from-url");
const React = require("react");

jest.mock("minimal-request", () =>
  jest.fn(({ url, timeout }, cb) => {
    var jsText = `var oc = {reactComponents: {}}; oc.reactComponents['666'] = class Hello extends React.Component {
    render() {
      return React.createElement("div", null, "Hello World");
    }
  }`;
    return cb(null, jsText);
  })
);

describe("When the module is called", () => {
  const predicate = getJSFromUrl({
    globals: { React },
    url: "cdn/path/to/file",
    key: "666",
    extractor: jest.fn((key, context) => context.oc.reactComponents[key])
  });

  test("Should correctly initialize a function", () => {
    expect(predicate).toBeInstanceOf(Function);
    expect(predicate.length).toBe(1);
  });

  describe("and the returned function is invoked", () => {
    test("should correctly return the evaluated js", done => {
      predicate((err, res) => {
        expect(err).toBe(null);
        expect(res).toBeInstanceOf(Function);
        expect(res.toString()).toMatchSnapshot();
        done();
      });
    });
  });
});
