const removeExtension = (path) => path.replace(/\.(j|t)sx?$/, '');

const higherOrderServerTemplate = ({ serverPath, componentName, componentVersion }) => `
import { data as dataProvider } from '${removeExtension(serverPath)}';

export const data = (context : any, callback : (error: any, data?: any) => void) => {
  dataProvider(context, (error: any, model: any) => {
    if (error) {
      return callback(error);
    }
    const props = Object.assign({}, model, {
      _staticPath: context.staticPath,
      _baseUrl: context.baseUrl,
      _componentName: "${componentName}",
      _componentVersion: "${componentVersion}"
    });
    const srcPathHasProtocol = context.staticPath.indexOf("http") === 0;
    const srcPath = srcPathHasProtocol ? context.staticPath : ("https:" + context.staticPath);
    return callback(null, Object.assign({}, {
      reactComponent: {
        props
      }
    }));
  });
}
`;

module.exports = higherOrderServerTemplate;
