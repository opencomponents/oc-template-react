import React from "react";
import { Consumer } from "./ocContext";

const withSettingProvider = BaseComponent => {
  const Enhanced = props => {
    return (
      <Consumer>
        {context => {
          const propsWithGetSetting = {
            ...props,
            getSetting: context.getSetting
          };

          return <BaseComponent {...propsWithGetSetting} />;
        }}
      </Consumer>
    );
  };

  return Enhanced;
};

export default withSettingProvider;
