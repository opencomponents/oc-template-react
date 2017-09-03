const render = require("../lib/render.js");

jest.mock("../lib/to-be-published/get-js-from-url", () => () => cb => {
  const React = require("react");
  class Hello extends React.Component {
    render() {
      return React.createElement("div", null, `Hello ${this.props.toWhat}`);
    }
  }
  return cb(null, Hello);
});

describe("render method", () => {
  describe("when invoked with a valid template", () => {
    const model = {
      reactComponent: {
        key: "de732592e9272bdc000899e1b2c9f6bf3c786e55",
        src:
          "http://localhost:3030/my-react-component/1.0.0/static/react-component.js",
        props: {
          name: "World",
          staticPath: "http://localhost:3030/my-react-component/1.0.0/static/"
        }
      }
    };
    const template = () => "<div>Hello</div>";
    const callback = jest.fn();

    render({ model, template }, callback);
    test("should correctly invoke the callback", () => {
      expect(callback).toBeCalledWith(null, "<div>Hello</div>");
    });
  });

  describe("when invoked with a broken view-model that throws an exception", () => {
    const model = { aModel: true };
    const template = () => {
      throw new Error("blargh");
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test("should correctly invoke the callback", () => {
      expect(callback).toBeCalledWith(
        new Error("Cannot read property 'src' of undefined")
      );
    });
  });
});
