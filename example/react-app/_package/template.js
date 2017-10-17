var oc = oc || {};
oc.components = oc.components || {};
oc.components["b2e2b4ca65f3cc6009bea778f9577db44f0ceab8"] = function(model) {
  return `<div id="43bf1af5-65c3-46aa-a532-e539c5b1b2b2">${model.__html
    ? model.__html
    : ""}</div>
          <style>.oc__react-app-styles-css__special__2q8ftRit {
  background: palevioletred;
  color: white;
}</style>
          <script>
            window.oc = window.oc || {};
            oc.cmd = oc.cmd || [];
            oc.cmd.push(function(oc){
              oc.requireSeries([{"global":"React","url":"https://unpkg.com/react@16.0.0/umd/react.production.min.js","name":"react"},{"global":"ReactDOM","url":"https://unpkg.com/react-dom@16.0.0/umd/react-dom.production.min.js","name":"react-dom"}], function(){
                oc.require(
                  ['oc', 'reactComponents', 'c55972357f496531fe91b1dd7677ea0ec7c4f0b9'],
                  '${model.reactComponent.props.staticPath}react-component.js',
                  function(ReactComponent){
                    var targetNode = document.getElementById("43bf1af5-65c3-46aa-a532-e539c5b1b2b2");
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
