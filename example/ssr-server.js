const http = require("http");
const url = require("url");
const querystring = require("querystring");
const oc = require("oc");

module.exports = (port, cb) => {
  port = port || 4000;
  cb =
    cb ||
    function() {
      console.log("started");
    };

  const client = new oc.Client({
    registries: {
      clientRendering: "http://localhost:3000/",
      serverRendering: "http://localhost:3000/"
    }
  });

  return http
    .createServer(function(req, res) {
      const query = querystring.parse(url.parse(req.url).query);
      const components = [
        { name: "oc-client" },
        { name: "react-app", parameters: query }
      ];
      const options = {
        container: false,
        timeout: 1000
      };

      client.renderComponents(components, options, function(
        err,
        renderedComponents
      ) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        const html = `<!DOCTYPE html>
        <html>
          <head>
            <title>A page</title>
          </head>
          <body>
          ${renderedComponents[1]}
          ${renderedComponents[0]}
          </body>
        </html>
      `;
        res.end(html);
      });
    })
    .listen(port, cb);
};
