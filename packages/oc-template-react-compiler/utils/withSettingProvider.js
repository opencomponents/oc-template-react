import React from "react";
import PropTypes from "prop-types";

const withSettingProvider = BaseComponent => {
  const Enhanced = (props, context) => {
    const propsWithGetSetting = {
      ...props,
      getSetting: context.getSetting
    };

    return <BaseComponent {...propsWithGetSetting} />;
  };

  Enhanced.contextTypes = {
    getSetting: PropTypes.func
  };

  return Enhanced;
};

export default withSettingProvider;
