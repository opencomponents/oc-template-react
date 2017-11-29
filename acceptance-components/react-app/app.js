import React from "react";
import styles from "./styles.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      timer: 0
    };
  }

  componentDidMount() {
    this.timerId = setInterval(() => {
      this.setState({ timer: this.state.timer + 1 });
    }, 100);
  }

  componentDidUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    return (
      <div className={styles.special}>
        <h1>
          Hello {this.props.name} {this.state.timer}
        </h1>
      </div>
    );
  }
}

export default App;
