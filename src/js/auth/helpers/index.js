export function getAuth (state) {
  return state.get('auth')
}

export function isAuthenticated (state) {
  return getAuth(state).get('authenticated')
}
