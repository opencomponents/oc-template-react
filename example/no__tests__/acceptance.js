jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const server = require("../server");
const { cli, Registry } = require("oc");
const path = require("path");
const r = require("request-promise-native");
const JSDOM = require("jsdom").JSDOM;
const fs = require("fs-extra");

const registryPort = 3000;
const registryUrl = `http://localhost:${registryPort}/`;
const serverPort = 4000;
const serverUrl = `http://localhost:${serverPort}/`;
const ocComponentPath = path.join(__dirname, "../react-app");
let registry;
let testServer;

beforeAll(done => {
  fs.removeSync(path.join(ocComponentPath, "../react-app/_package"));
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
        verbosity: 1,
        path: path.resolve("./example"),
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
      expect(body).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  const unrendered = r({
    uri: registryUrl + `react-app/?name=SuperMario`,
    headers: {
      Accept: "application/vnd.oc.unrendered+json"
    }
  })
    .then(function(body) {
      expect(body).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  Promise.all([rendered, unrendered])
    .then(done)
    .catch(err => done(err));
});

test("server-side-side rendering", done => {
  JSDOM.fromURL(serverUrl + `?name=SuperMario`, {})
    .then(dom => {
      expect(dom.serialize()).toMatchSnapshot();
      done();
    })
    .catch(err => {
      expect(err).toBeNull();
    });
});
