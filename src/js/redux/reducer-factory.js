export const reducerFactory = (initialState, actionHandlerMapping) =>
  (state = initialState, action) => {
    if (action === null) {
      return state
    }
    const handler = actionHandlerMapping[action.type]
    if (typeof handler !== 'function') {
      return state
    }
    return handler(state, action)
  }

export default reducerFactory
