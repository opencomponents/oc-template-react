jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require("path");
const fs = require("fs-extra");
const compileView = require("../lib/compileView.js");
jest.mock("uuid/v4", () => () => "666");

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

test("Should correctly compile the view", done => {
  compileView(options, (err, compiledViewInfo) => {
    expect(compiledViewInfo).toMatchSnapshot();
    expect(
      fs.readFileSync(path.join(publishPath, publishFileName), "UTF8")
    ).toMatchSnapshot();
    fs.removeSync(publishPath);
    done();
  });
});
