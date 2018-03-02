const reactOCProviderTemplate = ({ viewPath }) => `
  import PropTypes from 'prop-types';
  import React from 'react';
  import View from '${viewPath}';

  class OCProvider extends React.Component {
    componentDidMount(){
      const { _staticPath, _baseUrl, _componentName, _componentVersion, ...rest } = this.props;
      window.oc.events.fire('oc:componentDidMount',  rest);
    }

    getChildContext() {
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
      return (
        <View {...rest} />
      );
    }
  }

  OCProvider.childContextTypes = {
    getData: PropTypes.func,
    getSetting: PropTypes.func
  };
  export default OCProvider
`;

module.exports = reactOCProviderTemplate;
