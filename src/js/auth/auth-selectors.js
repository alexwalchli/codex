export function isAuthenticated (state) {
  return state.auth.get('authenticated')
}
