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

  const propertyPath = [];
  const cache = {};

  function listener(properties) {
    const calledFunction = function (event) {
      eventHandler(event, properties);
    };
    calledFunction.add = function(property) {
      const newProperties = bindState(property, properties);

      if (typeof cache[newProperties] == 'function') {
        return cache[newProperties];
      } else {
        const newListener = listener(newProperties);
        cache[newProperties] = newListener;
        return newListener;
      }
    };
    return calledFunction;
  }

  function eventHandler(e, propertyPath) {
    const newValue = handler(e);

    function deepAssign(level, levelState) {
      if (level < propertyPath.length) {
        const currentProperty = propertyPath[level];
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

  function bindState(property, properties) {
    const newProperties = [...properties];
    newProperties.push(property);
    return newProperties;
  }

  return listener(propertyPath);
}
// export 
module.exports = changeHandler;
//