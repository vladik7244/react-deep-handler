function defaultHandler(e) {
  switch (e.target.type) {
    case "checkbox":
      return e.target.checked;
    default:
      return e.target.value;
  }
}

const defaultGetState = component => () => {
  return component.state;
};
/**
 *
 * @param stateGetter function which should return state
 * @param handler function that receives React event object and should return valute that will be used in setter
 * @param stateSetter function that receives new state of component, which can be used like `this.setState(newState)`
 * @returns {*}
 */
function changeHandler(stateGetter, handler = defaultHandler, stateSetter = () => true) {
  let getState;
  switch (typeof stateGetter) {
    case 'function':
      getState = stateGetter;
      break;
    case 'object':
      getState = defaultGetState(stateGetter);
      break;
  }

  //Todo use Map
  const cache = {};

  function eventHandler(e, properties) {
    const newValue = handler(e);

    function deepAssign(level, levelState) {
      if (level < properties.length) {
        const currentProperty = properties[level];
        return {
          ...levelState,
          [currentProperty]: deepAssign(level + 1, levelState[currentProperty])
        }
      } else {
        return newValue;
      }
    }
    const newState = deepAssign(0, getState());

    stateSetter(newState);
  }

  return function(properties) {
    if (typeof cache[properties] == 'function') {
      return cache[properties];
    } else {
      const calledFunction = function (event) {
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