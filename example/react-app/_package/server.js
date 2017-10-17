module.exports = /******/ (function(modules) {
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
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
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
      Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
      /* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Users_nbalestra_OT_oc_template_react_example_react_app_server_js__ = __webpack_require__(
        1
      );

      const data = (context, callback) => {
        Object(
          __WEBPACK_IMPORTED_MODULE_0__Users_nbalestra_OT_oc_template_react_example_react_app_server_js__[
            "a" /* data */
          ]
        )(context, (error, model) => {
          if (error) {
            return callback(error);
          }
          const props = Object.assign({}, model, {
            staticPath: context.staticPath,
            baseUrl: context.baseUrl
          });
          const srcPath =
            context.env && context.env.name === "local"
              ? context.staticPath
              : "https:" + context.staticPath;
          return callback(
            null,
            Object.assign(
              {},
              {
                reactComponent: {
                  key: "c55972357f496531fe91b1dd7677ea0ec7c4f0b9",
                  src: srcPath + "react-component.js",
                  props
                }
              }
            )
          );
        });
      };
      /* harmony export (immutable) */ __webpack_exports__["data"] = data;

      /***/
    },
    /* 1 */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      "use strict";
      const data = (context, callback) => {
        const name = context.params.name;

        return callback(null, { name });
      };
      /* harmony export (immutable) */ __webpack_exports__["a"] = data;

      /***/
    }
    /******/
  ]
);
