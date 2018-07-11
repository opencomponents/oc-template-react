const reactOCProviderTemplate = ({ viewPath }) => `
  import React from 'react';
  import { Provider } from 'oc-template-react-compiler/utils/ocContext';
  import View from '${viewPath}';

  class OCProvider extends React.Component {
    componentDidMount(){
      const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = this.props;
      window.oc.events.fire('oc:componentDidMount',  rest);
    }

    buildActions() {
      const getData = (parameters, cb) => {
        return window.oc.getData({
          name: this.props._componentName,
          version: this.props._componentVersion,
          baseUrl: this.props._baseUrl,
          parameters
        }, (err, data) => {
          if (err) {
            return cb(err);
          }
          const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = data.reactComponent.props; 
          cb(null, rest, data.reactComponent.props);
        });
      };
      const getSetting = setting => {
        const settingHash = {
          name: this.props._componentName,
          version: this.props._componentVersion,
          baseUrl: this.props._baseUrl,
          staticPath: this.props._staticPath
        };
        return settingHash[setting];
      };
      return { getData, getSetting };
    }

    render() {
      const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = this.props;
      const actions = this.buildActions();
      return (
        <Provider value={actions}>
          <View {...rest} />
        </Provider>
      );
    }
  }

  export default OCProvider
`;

module.exports = reactOCProviderTemplate;
