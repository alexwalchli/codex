import * as authActionTypes from './auth-action-types'

export const updateAuthState = (user) => ({
  type: authActionTypes.UPDATE_AUTH_STATE,
  payload: user
})

export const signInError = (error) => ({
  type: authActionTypes.SIGN_IN_ERROR,
  payload: error
})

export const signInSuccess = (result) => ({
  type: authActionTypes.SIGN_IN_SUCCESS,
  payload: result.user
})

export const signOutSuccess = () => ({
  type: authActionTypes.SIGN_OUT_SUCCESS
})
