'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function defaultHandler(e) {
  switch (e.target.type) {
    case "checkbox":
      return e.target.checked;
    default:
      return e.target.value;
  }
}

var defaultGetState = function defaultGetState(component) {
  return function () {
    return component.state;
  };
};
/**
 *
 * @param stateGetter function which should return state
 * @param handler function that receives React event object and should return valute that will be used in setter
 * @param stateSetter function that receives new state of component, which can be used like `this.setState(newState)`
 * @returns {*}
 */
function changeHandler(stateGetter) {
  var handler = arguments.length <= 1 || arguments[1] === undefined ? defaultHandler : arguments[1];
  var stateSetter = arguments.length <= 2 || arguments[2] === undefined ? function () {
    return true;
  } : arguments[2];

  var getState = void 0;
  switch (typeof stateGetter === 'undefined' ? 'undefined' : _typeof(stateGetter)) {
    case 'function':
      getState = stateGetter;
      break;
    case 'object':
      getState = defaultGetState(stateGetter);
      break;
  }

  //Todo use Map
  var cache = {};

  function eventHandler(e, properties) {
    var newValue = handler(e);

    function deepAssign(level, levelState) {
      if (level < properties.length) {
        var currentProperty = properties[level];
        return _extends({}, levelState, _defineProperty({}, currentProperty, deepAssign(level + 1, levelState[currentProperty])));
      } else {
        return newValue;
      }
    }
    var newState = deepAssign(0, getState());

    stateSetter(newState);
  }

  return function (properties) {
    if (typeof cache[properties] == 'function') {
      return cache[properties];
    } else {
      var calledFunction = function calledFunction(event) {
        eventHandler(event, properties);
      };
      cache[properties] = calledFunction;
      return calledFunction;
    }
  };
}
// export
module.exports = changeHandler;
//
