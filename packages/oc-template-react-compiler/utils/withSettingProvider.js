import PropTypes from 'prop-types';
import React from 'React';

 
export default function(BaseComponent){
  const WithSettingProvider = (props, context) => {
    const getSetting = settingName => context[settingName];
    return (
      <BaseComponent {...props, getSetting} />
    );
  };

  WithSettingProvider.contextTypes = {
    getSetting: PropTypes.func
  };

  return WithSettingProvider;
}
