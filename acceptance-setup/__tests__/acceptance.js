/**
 * @testEnvironment jsdom
 */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const server = require("../server");
const { cli, Registry } = require("oc");
const path = require("path");
const r = require("request-promise-native");
const jsdom = require("jsdom");
const JSDOM = jsdom.JSDOM;
const fs = require("fs-extra");

jest.unmock("minimal-request");

const registryPort = 3000;
const registryUrl = `http://localhost:${registryPort}/`;
const serverPort = 4000;
const serverUrl = `http://localhost:${serverPort}/`;
const ocComponentPath = path.join(
  __dirname,
  "../../acceptance-components/react-app"
);
let registry;
let testServer;

const semverRegex = /\bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?\b/gi;

beforeAll(done => {
  fs.removeSync(path.join(ocComponentPath, "_package"));
  cli.package(
    {
      componentPath: ocComponentPath
    },
    (err, compiledInfo) => {
      if (err) {
        return done(err);
      }

      registry = new Registry({
        local: true,
        discovery: true,
        verbosity: 0,
        path: path.join(__dirname, "../../acceptance-components"),
        port: registryPort,
        baseUrl: registryUrl,
        env: { name: "local" },
        templates: [require("../../packages/oc-template-react")]
      });

      registry.start(err => {
        if (err) {
          return done(err);
        }
        testServer = server(serverPort, err => {
          if (err) {
            return done(err);
          }
          done();
        });
      });
    }
  );
});

afterAll(done => {
  testServer.close(() => {
    registry.close(() => {
      fs.removeSync(path.join(ocComponentPath, "_package"));
      done();
    });
  });
});

test("Registry should correctly serve rendered and unrendered components", done => {
  const rendered = r(registryUrl + `react-app/?name=SuperMario`)
    .then(function(body) {
      const bodyVersionless = body.replace(semverRegex, "6.6.6");
      expect(bodyVersionless).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  const unrendered = r({
    uri: registryUrl + `react-app/?name=SuperMario`,
    headers: {
      Accept: "application/vnd.oc.unrendered+json"
    }
  })
    .then(function(body) {
      const bodyVersionless = body.replace(semverRegex, "6.6.6");
      expect(bodyVersionless).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  Promise.all([rendered, unrendered])
    .then(() => done())
    .catch(err => done(err));
});

test("server-side-side rendering", done => {
  JSDOM.fromURL(serverUrl + `?name=SuperMario`, {})
    .then(dom => {
      const domVersionless = dom.serialize().replace(semverRegex, "6.6.6");
      expect(domVersionless).toMatchSnapshot();
      done();
    })
    .catch(err => done(err));
});

test("client-side-side rendering", done => {
  const virtualConsole = new jsdom.VirtualConsole();
  const mockLog = jest.fn(() => {});
  virtualConsole.on("log", mockLog);
  JSDOM.fromURL(`${registryUrl}react-app/~preview?name=SuperMario`, {
    resources: "usable",
    runScripts: "dangerously",
    virtualConsole
  })
    .then(dom => {
      setTimeout(() => {
        expect(mockLog.mock.calls).toMatchSnapshot();
        const nameNode = dom.window.document.getElementById("1");
        expect(nameNode).toMatchSnapshot();
        done();
      }, 5000);
    })
    .catch(err => done(err));
});
