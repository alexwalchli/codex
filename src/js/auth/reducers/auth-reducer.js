import * as authActionTypes from '../actions/auth-action-types'

export const AuthState = {
  authenticated: false,
  id: null
}

export function auth (state = {}, {payload, type}) {
  switch (type) {
    case authActionTypes.UPDATE_AUTH_STATE:
    case authActionTypes.SIGN_IN_SUCCESS:
      return Object.assign(state, {
        initialCheck: true,
        authenticated: !!payload,
        id: payload ? payload.uid : null,
        displayName: payload ? payload.displayName : null,
        email: payload ? payload.email : null
      })
    case authActionTypes.SIGN_OUT_SUCCESS:
      return {
        authenticated: false,
        id: null
      }
    default:
      return state
  }
}
