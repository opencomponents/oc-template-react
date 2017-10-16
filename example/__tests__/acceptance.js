jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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
    console.log(err);
    ssrServer = server(serverPort, err => {
      console.log(err);
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
  const renderedTest = r(registryUrl)
    .then(function(body) {
      expect(body).toMatchSnapshot();
    })
    .catch(err => expect(err).toBeNull());

  // const rendered = r(registryUrl + `react-app/?name=SuperMario`)
  //   .then(function(body) {
  //     expect(body).toMatchSnapshot();
  //   })
  //   .catch(err => expect(err).toBeNull());

  // const unrendered = r({
  //   uri: registryUrl + `react-app/?name=SuperMario`,
  //   headers: {
  //     Accept: "application/vnd.oc.unrendered+json"
  //   }
  // })
  //   .then(function(body) {
  //     expect(body).toMatchSnapshot();
  //   })
  //   .catch(err => expect(err).toBeNull());

  Promise.all([renderedTest]).then(done);
});

// test("server-side-side rendering", done => {
//   JSDOM.fromURL(serverUrl + `?name=SuperMario`, {})
//     .then(dom => {
//       expect(dom.serialize()).toMatchSnapshot();
//       done();
//     })
//     .catch(err => {
//       expect(err).toBeNull();
//     });
// });
