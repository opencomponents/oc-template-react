import React from "react";
// import PropTypes from 'prop-types';
import styles from "./styles.css";
import {
  withDataProvider,
  withSettingProvider
} from "oc-template-react-compiler/utils";

// class App extends React.Component {

//   constructor(props, context) {
//     super(props, context);
//     this.props = props;
//     this.context = context;
//     this.state = {
//       timer: 0,
//       context : this.context
//     };
//   }

//   componentDidMount() {
//     this.timerId = setInterval(() => {
//       this.setState({ timer: this.state.timer + 1 });
//     }, 100);
//   }

//   componentDidUnmount() {
//     clearTimeout(this.timerId);
//   }

//   render() {
//     return (
//       <div className={styles.special}>
//         <h1>
//           Hello {this.props.name} {this.state.timer}
//           <pre>
//            {JSON.stringify(this.state)}
//           </pre>
//         </h1>
//       </div>
//     );
//   }
// }

// App.contextTypes = {
//   getData: PropTypes.func
// };

// const withData = Component => {
//   const Appo = (props, context) => {
//     const propsWithData = {
//       ...props,
//       getData: context.getData
//     };

//     return (<Component {...propsWithData}/>)
//   };

//   Appo.contextTypes = {
//     getData: PropTypes.func
//   };

//   return Appo;
// }

const App = props => {
  // const propsWithColor = {
  //   ...props,
  //   getColor: context.getColor
  // };

  return (
    <div>
      Hello {props.name}
      <pre>{props.getData.toString()}</pre>
      <p>{props.getSetting("name")}</p>
      <p>{props.getSetting("version")}</p>
      <p>{props.getSetting("baseUrl")}</p>
      <p>{props.getSetting("staticPath")}</p>
    </div>
  );
};

export default withSettingProvider(withDataProvider(App));
