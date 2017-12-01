const higherOrderServerTemplate = ({
  serverPath,
  bundleHashKey,
  componentName,
  componentVersion
}) => `
import { data as dataProvider } from '${serverPath}';
export const data = (context, callback) => {
  dataProvider(context, (error, model) => {
    if (error) {
      return callback(error);
    }
    const props = Object.assign({}, model, {
      _staticPath: context.staticPath,
      _baseUrl: context.baseUrl,
      _componentName: "${componentName}",
      _componentVersion: "${componentVersion}"
    });
    const srcPath = (context.env && context.env.name === "local") ? context.staticPath : "https:" + context.staticPath ;
    return callback(null, Object.assign({}, {
      reactComponent: {
        key: "${bundleHashKey}",
        src: srcPath + "react-component.js",
        props
      }
    }));
  });
}
`;

module.exports = higherOrderServerTemplate;
