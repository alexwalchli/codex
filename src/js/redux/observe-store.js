export const observeStore = (store, select, onChange) => {
  let currentState

  function handleChange () {
    let nextState = select(store.getState())
    if (nextState !== currentState) {
      onChange(currentState, nextState)
      currentState = nextState
    }
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return { unsubscribe }
}
