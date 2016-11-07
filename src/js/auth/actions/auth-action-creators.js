import { firebaseAuth } from '../../firebase'
import firebase from 'firebase'
import * as authActionTypes from './auth-action-types'

export const signInWithGithub = () => authenticate(new firebase.auth.GithubAuthProvider())
export const signInWithGoogle = () => authenticate(new firebase.auth.GoogleAuthProvider())
export const signInWithTwitter = () => authenticate(new firebase.auth.TwitterAuthProvider())

const authenticate = (provider) =>
  dispatch => {
    firebaseAuth.signInWithPopup(provider)
      .then(result => dispatch(authActionTypes.signInSuccess(result)))
      .catch(error => dispatch(authActionTypes.signInError(error)))
  }

export const signInSuccess = (result) =>
  (dispatch, getState) => {
    dispatch(authActionTypes.signInSuccess(result))
  }

export const signOut = () =>
  dispatch => {
    firebaseAuth.signOut().then(() => dispatch(authActionTypes.signOutSuccess()))
  }
