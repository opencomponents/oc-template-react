const viewTemplate = ({
  reactRoot,
  css,
  externals,
  bundleHash,
  bundleName
}) => `function(model){
  return \`<div id="${reactRoot}" class="${reactRoot}">\${ model.__html ? model.__html : '' }</div>
    <style>${css}</style>
    <script>
      window.oc = window.oc || {};
      oc.cmd = oc.cmd || [];
      oc.cmd.push(function(oc){
        oc.requireSeries(${JSON.stringify(externals)}, function(){
          oc.require(
            ['oc', 'reactComponents', '${bundleHash}'],
            '\${model.reactComponent.props._staticPath}${bundleName}.js',
            function(ReactComponent){
              var targetNode = document.getElementById("${reactRoot}");
              targetNode.setAttribute("id","");
              ReactDOM.render(React.createElement(ReactComponent, \${JSON.stringify(model.reactComponent.props)}),targetNode);
            }
          );
        });
      });
    </script>
  \`;
}`;

module.exports = viewTemplate;
