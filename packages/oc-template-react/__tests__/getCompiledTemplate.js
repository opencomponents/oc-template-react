const { getCompiledTemplate } = require("../index");

test("Return compiled template when valid", () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9={template:function(model){return"Hello world!"}};';
  const key = "c6fcae4d23d07fd9a7e100508caf8119e998d7a9";

  expect(getCompiledTemplate(template, key)).toMatchSnapshot();
});

test("Throw exception when js is not valid", () => {
  const template =
    "var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9=nojavascript);";
  const key = "c6fcae4d23d07fd9a7e100508caf8119e998d7a9";

  expect(() =>
    getCompiledTemplate(template, key)
  ).toThrowErrorMatchingSnapshot();
});

test("Be undefined when key is not valid", () => {
  const template =
    'var oc=oc||{};oc.components=oc.components||{},oc.components.c6fcae4d23d07fd9a7e100508caf8119e998d7a9={template:function(model){return"Hello world!"}}';
  const key = "not valid key";

  expect(getCompiledTemplate(template, key)).toBeUndefined();
});
