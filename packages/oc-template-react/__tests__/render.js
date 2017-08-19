const { render } = require("../index");

describe("render method", () => {
  describe("when invoked with a valid template", () => {
    const model = { name: "world" };
    const template = model => `Hello ${model.name}!`;
    const callback = jest.fn();

    render({ model, template }, callback);
    test("should correctly invoke the callback", () => {
      expect(callback).toBeCalledWith(null, "Hello world!");
    });
  });

  describe("when invoked with a broken view-model that throws an exception", () => {
    const model = { name: "world" };
    const template = model => {
      throw new Error("blargh");
    };
    const callback = jest.fn();

    render({ model, template }, callback);
    test("should correctly invoke the callback", () => {
      expect(callback).toBeCalledWith(new Error("blargh"));
    });
  });
});
