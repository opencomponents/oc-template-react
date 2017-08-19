const template = require("../index.js");

test("should expose the correct methods", () => {
  expect(template).toMatchSnapshot();
});
