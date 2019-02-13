import React from "react";
import { Consumer } from "./ocContext";

const withDataProvider = BaseComponent => {
  const Enhanced = props => {
    return (
      <Consumer>
        {context => {
          const propsWithGetData = {
            ...props,
            getData: context.getData
          };

          return <BaseComponent {...propsWithGetData} />;
        }}
      </Consumer>
    );
  };

  return Enhanced;
};

export default withDataProvider;
