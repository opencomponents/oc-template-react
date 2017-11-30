module.exports = (opts, cb) => {
  var jsText = `var oc = {reactComponents: {}}; oc.reactComponents['666'] = class Hello extends React.Component {
    render() {
      return React.createElement("div", null, "Hello World");
    }
  }`;
  return cb(null, jsText);
};
