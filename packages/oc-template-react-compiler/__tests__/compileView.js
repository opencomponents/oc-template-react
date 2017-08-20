jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require("path");
const fs = require("fs-extra");
const compileView = require("../lib/compileView.js");

const componentPath = path.join(__dirname, "../../mocks/react-component");
const publishPath = path.join(componentPath, "_package");
const publishFileName = "template.js";
const componentPackage = require(componentPath + "/package.json");
const options = {
  componentPackage,
  componentPath,
  publishPath,
  publishFileName
};
// console.log(componentPackage.oc.files.template.src)
test("Should correctly compile the view", done => {
  compileView(options, (err, compiledViewInfo) => {
    delete compiledViewInfo.hashKey;
    expect(compiledViewInfo).toMatchSnapshot();
    // expect(
    //   fs.readFileSync(path.join(publishPath, publishFileName), 'UTF8')
    // ).toMatchSnapshot();
    // fs.removeSync(path.join(publishPath, publishFileName));
    done();
  });
});
