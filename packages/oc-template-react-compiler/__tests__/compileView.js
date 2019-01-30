jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require("path");
const fs = require("fs-extra");
const compileView = require("../lib/compileView.js");
const packageInfo = require("../../oc-template-react/package.json");

const versions = {
  propTypes: packageInfo.dependencies["prop-types"],
  react: packageInfo.dependencies.react,
  reactDom: packageInfo.dependencies["react-dom"]
};

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
        .replace(
          /\[\"oc\",.*?\"reactComponents\",.*?\".*?\"\]/g,
          '["oc", "reactComponents", "dummyContent"]'
        )
        .replace(`prop-types@${versions.propTypes}`, "prop-types@x.x.x")
        .replace(`react@${versions.react}`, "react@x.x.x")
        .replace(`react-dom@${versions.reactDom}`, "react-dom@x.x.x")
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
