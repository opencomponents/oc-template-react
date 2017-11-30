const React = require("react");

module.exports = () => cb => {
  class Hello extends React.Component {
    render() {
      return React.createElement("div", null, `Hello ${this.props.toWhat}`);
    }
  }
  return cb(null, Hello);
};
