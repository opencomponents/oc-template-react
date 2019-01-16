const { getInfo } = require("../index");
const packageInfo = require("../package.json");

const versions = {
  propTypes: packageInfo.dependencies["prop-types"],
  react: packageInfo.dependencies.react,
  reactDom: packageInfo.dependencies["react-dom"]
};

test("should return the correct info", () => {
  const info = getInfo();
  delete info.version;

  info.externals.forEach(
    external =>
      (external.url = external.url
        .replace(`prop-types@${versions.propTypes}`, "prop-types@x.x.x")
        .replace(`react@${versions.react}`, "react@x.x.x")
        .replace(`react-dom@${versions.reactDom}`, "react-dom@x.x.x"))
  );

  expect(info).toMatchSnapshot();
});
