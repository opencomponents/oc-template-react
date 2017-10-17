var oc = oc || {};
oc.reactComponents = oc.reactComponents || {};
oc.reactComponents["c55972357f496531fe91b1dd7677ea0ec7c4f0b9"] =
  oc.reactComponents["c55972357f496531fe91b1dd7677ea0ec7c4f0b9"] ||
  (function() {
    var module = /******/ (function(modules) {
      // webpackBootstrap
      /******/ // The module cache
      /******/ var installedModules = {}; // The require function
      /******/
      /******/ /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
          /******/ return installedModules[moduleId].exports;
          /******/
        } // Create a new module (and put it into the cache)
        /******/ /******/ var module = (installedModules[moduleId] = {
          /******/ i: moduleId,
          /******/ l: false,
          /******/ exports: {}
          /******/
        }); // Execute the module function
        /******/
        /******/ /******/ modules[moduleId].call(
          module.exports,
          module,
          module.exports,
          __webpack_require__
        ); // Flag the module as loaded
        /******/
        /******/ /******/ module.l = true; // Return the exports of the module
        /******/
        /******/ /******/ return module.exports;
        /******/
      } // expose the modules object (__webpack_modules__)
      /******/
      /******/
      /******/ /******/ __webpack_require__.m = modules; // expose the module cache
      /******/
      /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
      /******/
      /******/ /******/ __webpack_require__.d = function(
        exports,
        name,
        getter
      ) {
        /******/ if (!__webpack_require__.o(exports, name)) {
          /******/ Object.defineProperty(exports, name, {
            /******/ configurable: false,
            /******/ enumerable: true,
            /******/ get: getter
            /******/
          });
          /******/
        }
        /******/
      }; // getDefaultExport function for compatibility with non-harmony modules
      /******/
      /******/ /******/ __webpack_require__.n = function(module) {
        /******/ var getter =
          module && module.__esModule
            ? /******/ function getDefault() {
                return module["default"];
              }
            : /******/ function getModuleExports() {
                return module;
              };
        /******/ __webpack_require__.d(getter, "a", getter);
        /******/ return getter;
        /******/
      }; // Object.prototype.hasOwnProperty.call
      /******/
      /******/ /******/ __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
      }; // __webpack_public_path__
      /******/
      /******/ /******/ __webpack_require__.p = ""; // Load entry module and return exports
      /******/
      /******/ /******/ return __webpack_require__((__webpack_require__.s = 0));
      /******/
    })(
      /************************************************************************/
      /******/ [
        /* 0 */
        /***/ function(module, __webpack_exports__, __webpack_require__) {
          "use strict";
          Object.defineProperty(__webpack_exports__, "__esModule", {
            value: true
          });
          /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(
            1
          );
          /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(
            __WEBPACK_IMPORTED_MODULE_0_react__
          );
          /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_css__ = __webpack_require__(
            2
          );
          /* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__styles_css___default = __webpack_require__.n(
            __WEBPACK_IMPORTED_MODULE_1__styles_css__
          );
          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }

          function _possibleConstructorReturn(self, call) {
            if (!self) {
              throw new ReferenceError(
                "this hasn't been initialised - super() hasn't been called"
              );
            }
            return call &&
              (typeof call === "object" || typeof call === "function")
              ? call
              : self;
          }

          function _inherits(subClass, superClass) {
            if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError(
                "Super expression must either be null or a function, not " +
                  typeof superClass
              );
            }
            subClass.prototype = Object.create(
              superClass && superClass.prototype,
              {
                constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
                }
              }
            );
            if (superClass)
              Object.setPrototypeOf
                ? Object.setPrototypeOf(subClass, superClass)
                : (subClass.__proto__ = superClass);
          }

          var App = (function(_React$Component) {
            _inherits(App, _React$Component);

            function App(props) {
              _classCallCheck(this, App);

              var _this = _possibleConstructorReturn(
                this,
                _React$Component.call(this, props)
              );

              _this.props = props;
              _this.state = {
                timer: 0
              };
              return _this;
            }

            App.prototype.componentDidMount = function componentDidMount() {
              var _this2 = this;

              this.timerId = setInterval(function() {
                _this2.setState({ timer: _this2.state.timer + 1 });
              }, 100);
            };

            App.prototype.componentDidUnmount = function componentDidUnmount() {
              clearTimeout(this.timerId);
            };

            App.prototype.render = function render() {
              return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                "div",
                {
                  className:
                    __WEBPACK_IMPORTED_MODULE_1__styles_css___default.a.special
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                  "h1",
                  null,
                  "Hello ",
                  this.props.name,
                  " ",
                  this.state.timer
                )
              );
            };

            return App;
          })(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

          /* harmony default export */ __webpack_exports__["default"] = App;

          /***/
        },
        /* 1 */
        /***/ function(module, exports) {
          module.exports = React;

          /***/
        },
        /* 2 */
        /***/ function(module, exports) {
          // removed by extract-text-webpack-plugin
          module.exports = {
            special: "oc__react-app-styles-css__special__2q8ftRit"
          };

          /***/
        }
        /******/
      ]
    );
    return module.default;
  })();
