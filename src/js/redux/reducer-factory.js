// export function defineReducer<S, T, A>(
//   initial: S,
//   mapping: ReducerMap<S, T, A>
// ): Reducer<S, T, A> {
//   return function reducer(
//     state: S = initial,
//     action?: Action<T, A>
//   ): S {
//     if (action == null) {
//       return state;
//     }
//     const handler = mapping[action.type];
//     if (typeof handler !== "function") {
//       return state;
//     }
//     return handler(state, action);
//   };
// }

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

