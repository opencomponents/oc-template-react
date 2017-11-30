import React from "react";
import PropTypes from "prop-types";

const withDataProvider = BaseComponent => {
  const Enhanced = (props, context) => {
    const propsWithGetData = {
      ...props,
      getData: context.getData
    };

    return <BaseComponent {...propsWithGetData} />;
  };

  Enhanced.contextTypes = {
    getData: PropTypes.func
  };

  return Enhanced;
};

export default withDataProvider;
