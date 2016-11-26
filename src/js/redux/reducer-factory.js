export const reducerFactory = (actionHandlerMapping) =>
  (state, action) => {
    if (action === null) {
      return state
    }
    const handler = actionHandlerMapping[action.type]
    if (typeof handler !== 'function') {
      return state
    }
    return handler(state, action)
  }

