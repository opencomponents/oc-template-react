const compiler = require("../index");

test("should expose the correct methods", () => {
  expect(compiler).toMatchSnapshot();
});
