jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const path = require("path");
const fs = require("fs-extra");
const compileServer = require("../lib/compileServer.js");
jest.mock("uuid/v4", () => () => "666");

const componentPath = path.join(__dirname, "../../../mocks/react-component");
const publishPath = path.join(componentPath, "_packageCompileServerTest");
const publishFileName = "server.js";

const options = {
  componentPackage: fs.readJsonSync(`${componentPath}/package.json`),
  componentPath,
  publishPath,
  publishFileName
};

test("Should correctly compile the server", done => {
  compileServer(
    { options, compiledInfo: { bundle: { hashKey: "666" } } },
    (err, compiledServerInfo) => {
      expect(err).toBeNull();
      expect(compiledServerInfo).toMatchSnapshot();
      expect(
        fs.readFileSync(path.join(publishPath, publishFileName), "UTF8")
      ).toMatchSnapshot();
      fs.removeSync(publishPath);
      done();
    }
  );
});
