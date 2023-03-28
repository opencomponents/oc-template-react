const removeExtension = (path) => path.replace(/\.(t|j)sx?$/, '');

const reactOCProviderTemplate = ({ viewPath }) => `
  import React from 'react';
  import View from '${removeExtension(viewPath)}';
  import { DataProvider } from 'oc-template-typescript-react-compiler/utils/useData'

  class OCProvider extends React.Component {
    componentDidMount(){
      const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = (this.props as any);
      (window as any).oc.events.fire('oc:componentDidMount',  rest);
    }

    getData(providerProps: any, parameters: any, cb: (error: any, parameters?: any, props?: any) => void) {
      return (window as any).oc.getData({
        name: providerProps._componentName,
        version: providerProps._componentVersion,
        baseUrl: providerProps._baseUrl,
        parameters
      }, (err: any, data: any) => {
        if (err) {
          return cb(err);
        }
        const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = (data.reactComponent.props as any); 
        cb(null, rest, data.reactComponent.props);
      });
    }

    getSetting(providerProps: any, setting: string) {
      const settingHash = {
        name: providerProps._componentName,
        version: providerProps._componentVersion,
        baseUrl: providerProps._baseUrl,
        staticPath: providerProps._staticPath
      };
      return (settingHash as any)[setting];
    }

    render() {
      const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = (this.props as any);
      (rest as any).getData = (parameters: any, cb: (error: any, parameters?: any, props?: any) => void) => this.getData(this.props, parameters, cb);
      (rest as any).getSetting = (setting: string) => this.getSetting(this.props, setting);
      return (
        <DataProvider value={{...rest}}>
          <View { ...rest } />
        </DataProvider>
      );
    }
  }

  export default OCProvider
`;

module.exports = reactOCProviderTemplate;
