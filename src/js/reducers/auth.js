import { UPDATE_AUTH_STATE, SIGN_IN_SUCCESS, SIGN_OUT_SUCCESS } from '../actions/auth'

export const AuthState = {
  authenticated: false,
  id: null
}

export function auth (state = {}, {payload, type}) {
  switch (type) {
    case UPDATE_AUTH_STATE:
    case SIGN_IN_SUCCESS:
      return Object.assign(state, {
        initialCheck: true,
        authenticated: !!payload,
        id: payload ? payload.uid : null,
        displayName: payload ? payload.displayName : null,
        email: payload ? payload.email : null
      })
    case SIGN_OUT_SUCCESS:
      return {
        authenticated: false,
        id: null
      }
    default:
      return state
  }
}
