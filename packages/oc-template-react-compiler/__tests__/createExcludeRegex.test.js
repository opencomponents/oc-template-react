const createExcludeRegex = require("../lib/to-abstract-base-template-utils/oc-webpack/lib/configurator/createExcludeRegex");

test("should create a regex that match against any node module set aside given ones", () => {
  const regex = createExcludeRegex([
    "oc-template-react-compiler/utils",
    "underscore"
  ]);
  expect(regex).toBeInstanceOf(RegExp);

  expect(regex.test("node_modules/lodash")).toBe(true);
  expect(regex.test("node_modules/oc-template-react-compiler")).toBe(true);

  expect(regex.test("node_modules/oc-template-react-compiler/utils")).toBe(
    false
  );
  expect(regex.test("node_modules/underscore")).toBe(false);
});
