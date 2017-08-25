import React from "react";
import styles from "./styles.css";

class myApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () =>
        this.setState({
          date: new Date()
        }),
      1
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
      <div className={styles.nicer}>
        <h1>
          Hello {this.props.name}!
        </h1>
        <h2>
          It is {this.state.date.getHours()}:
          {this.state.date.getMinutes()}:
          {this.state.date.getSeconds()}:
          {this.state.date.getMilliseconds()}
        </h2>
      </div>
    );
  }
}

export default myApp;
