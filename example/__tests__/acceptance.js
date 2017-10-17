jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

const server = require("../ssr-server");
const oc = require("oc");
const path = require("path");
const r = require("request-promise-native");
const JSDOM = require("jsdom").JSDOM;

const registryPort = 3000;
const registryUrl = `http://localhost:${registryPort}/`;
const serverPort = 4000;
const serverUrl = `http://localhost:${serverPort}/`;

let registry;
let ssrServer;

beforeAll(done => {
  registry = new oc.Registry({
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
    ssrServer = server(serverPort, err => {
      if (err) {
        return done(err);
      }
      done();
    });
  });
});

afterAll(done => {
  ssrServer.close(() => {
    registry.close(() => {
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
