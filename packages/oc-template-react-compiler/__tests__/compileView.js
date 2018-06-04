jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require("path");
const fs = require("fs-extra");
const compileView = require("../lib/compileView.js");

test("valid component", done => {
  const componentPath = path.join(__dirname, "../../../mocks/react-component");
  const publishPath = path.join(componentPath, "_packageCompileViewTest");
  const publishFileName = "template.js";

  const options = {
    componentPackage: fs.readJsonSync(`${componentPath}/package.json`),
    componentPath,
    publishPath,
    publishFileName,
    production: true
  };

  compileView(options, (err, compiledViewInfo) => {
    compiledViewInfo.bundle.hashKey = "dummyData";
    const viewHashKey = compiledViewInfo.template.hashKey;
    compiledViewInfo.template.hashKey = "dummyData";
    expect(compiledViewInfo).toMatchSnapshot();
    expect(
      fs
        .readFileSync(path.join(publishPath, publishFileName), "UTF8")
        .replace(viewHashKey, "dummyData")
    ).toMatchSnapshot();
    fs.removeSync(publishPath);
    done();
  });
});

test("invalid component", done => {
  const componentPath = path.join(
    __dirname,
    "../../../mocks/invalid-jsx-component"
  );
  const publishPath = path.join(componentPath, "_packageCompileViewTest2");
  const publishFileName = "template.js";

  const options = {
    componentPackage: fs.readJsonSync(`${componentPath}/package.json`),
    componentPath,
    publishPath,
    publishFileName,
    production: true
  };

  compileView(options, (err, compiledViewInfo) => {
    expect(err).toContain(
      "Adjacent JSX elements must be wrapped in an enclosing tag"
    );
    done();
  });
});
