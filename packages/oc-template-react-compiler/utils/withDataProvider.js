import PropTypes from 'prop-types';
import React from 'React';


export default function(BaseComponent){
  const WithDataProvider = (props, context) => (
    <BaseComponent {...props, getData: context.getData} />
  );

  WithDataProvider.contextTypes = {
    getData: PropTypes.func
  };

  return WithDataProvider;
}
