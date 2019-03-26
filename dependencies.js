const fs = require("fs");
const package = require("./packages/oc-template-react/package.json");

package.externals["prop-types"].url = `https://unpkg.com/prop-types@${
  package.dependencies["prop-types"]
}/prop-types.min.js`;
package.externals.react.url = `https://unpkg.com/react@${
  package.dependencies.react
}/umd/react.production.min.js`;
package.externals["react-dom"].url = `https://unpkg.com/react-dom@${
  package.dependencies["react-dom"]
}/umd/react-dom.production.min.js`;

fs.writeFileSync(
  "./packages/oc-template-react/package.json",
  JSON.stringify(package, null, 2) + "\n",
  "utf-8"
);
