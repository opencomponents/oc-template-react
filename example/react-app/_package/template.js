var oc = oc || {};
oc.components = oc.components || {};
oc.components["37ac7340d4fec6017c33f583bfdb1cfc615d6550"] = function(model) {
  return `<div id="d3d751e0-1e84-40a8-8d04-761b407fe35a">${model.__html
    ? model.__html
    : ""}</div>
          <style>.oc__example-react-app-styles-css__special__3K6pmcHx {
  background: palevioletred;
  color: white;
}</style>
          <script>
            window.oc = window.oc || {};
            oc.cmd = oc.cmd || [];
            oc.cmd.push(function(oc){
              oc.requireSeries([{"global":"React","url":"https://unpkg.com/react@15.6.2/dist/react.min.js","name":"react"},{"global":"ReactDOM","url":"https://unpkg.com/react-dom@15.6.2/dist/react-dom.min.js","name":"react-dom"}], function(){
                oc.require(
                  ['oc', 'reactComponents', '4622357d373e786649bf2b755e46b8fc7d5f03b6'],
                  '${model.reactComponent.props.staticPath}react-component.js',
                  function(ReactComponent){
                    var targetNode = document.getElementById("d3d751e0-1e84-40a8-8d04-761b407fe35a");
                    targetNode.setAttribute("id","");
                    ReactDOM.render(React.createElement(ReactComponent, ${JSON.stringify(
                      model.reactComponent.props
                    )}),targetNode);
                  }
                );
              });
            });
          </script>
        `;
};
