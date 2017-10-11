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
    path: path.join(__dirname, "../"),
    port: registryPort,
    baseUrl: registryUrl,
    env: { name: "local" },
    templates: [require("oc-template-react")]
  });
  registry.start(err => {
    ssrServer = server(serverPort, done);
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
  const rendered = r(registryUrl + `react-app/?name=SuperMario`).then(function(
    body
  ) {
    expect(body).toMatchSnapshot();
  });

  const unrendered = r({
    uri: registryUrl + `react-app/?name=SuperMario`,
    headers: {
      Accept: "application/vnd.oc.unrendered+json"
    }
  }).then(function(body) {
    expect(body).toMatchSnapshot();
  });

  Promise.all([rendered, unrendered]).then(done);
});

test("server-side-side rendering", done => {
  JSDOM.fromURL(serverUrl + `?name=SuperMario`, {}).then(dom => {
    expect(dom.serialize()).toMatchSnapshot();
    done();
  });
});
