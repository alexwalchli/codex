export const observeStore = (store, select, onChange) => {
  let currentSelectedState

  function handleChange () {
    const state = store.getState()
    const appInitialized = state.app.get('appInitialized')
    let nextSelectedState = select(state)

    if (appInitialized && nextSelectedState !== currentSelectedState) {
      onChange(state, currentSelectedState, nextSelectedState)
      currentSelectedState = nextSelectedState
    }
  }

  let unsubscribe = store.subscribe(handleChange)
  handleChange()
  return { unsubscribe }
}
