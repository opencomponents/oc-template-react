import React from "react";
import styles from "./styles.css";
import {
  withDataProvider,
  withSettingProvider
} from "oc-template-react-compiler/utils";

const App = props => (
  <div>
    Hello {props.name}
    <pre>{props.getData.toString()}</pre>
    <p>{props.getSetting("name")}</p>
    <p>{props.getSetting("version")}</p>
    <p>{props.getSetting("baseUrl")}</p>
    <p>{props.getSetting("staticPath")}</p>
  </div>
);

export default withSettingProvider(withDataProvider(App));
