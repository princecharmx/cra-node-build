// call middleware lets you
export function callApiMiddleWare({ dispatch, getState }) {
  // next lets you dispatch next action
  return next => action => {
    //extrating types to not pass every action through it
    const { callAPI, types, types: { 0: request, 1: success, 2: failure }, payload } = action;
    // if type is not of api return
    if (!types) {
      return next(action);
    }

    //check for api action.types to be an array, length 3, type of string
    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.');
    }

    if (typeof callAPI !== 'function') {
      throw new Error('Expected callAPI to be a function.');
    }
    dispatch(Object.assign({}, { type: request, payload: {} }));
    return callAPI()
      .then(res => dispatch(Object.assign({}, { type: success, payload: res })))
      .catch(error => dispatch(Object.assign({}, { type: failure, error })));
  };
}
