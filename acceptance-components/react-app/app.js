import React from "react";
import {
  withDataProvider,
  withSettingProvider
} from "oc-template-react-compiler/utils";

import styles from "./styles.css";

const App = props => (
  <div className={styles.special}>
    <h1>Hello {props.name}</h1>
    <pre>{props.getData.toString()}</pre>
    <p>component name: {props.getSetting("name")}</p>
    <p>component version: {props.getSetting("version")}</p>
    <p>registry baseUrl: {props.getSetting("baseUrl")}</p>
    <p>component staticPath: {props.getSetting("staticPath")}</p>
  </div>
);

export default withSettingProvider(withDataProvider(App));
