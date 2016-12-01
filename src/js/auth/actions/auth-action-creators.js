import { firebaseAuth } from '../../firebase'
import firebase from 'firebase'
import * as authActions from './auth-actions'

export const signInWithGithub = () => authenticate(new firebase.auth.GithubAuthProvider())
export const signInWithGoogle = () => authenticate(new firebase.auth.GoogleAuthProvider())
export const signInWithTwitter = () => authenticate(new firebase.auth.TwitterAuthProvider())

const authenticate = (provider) =>
  dispatch => {
    firebaseAuth.signInWithPopup(provider)
      .then(result => dispatch(authActions.signInSuccess(result)))
      .catch(error => dispatch(authActions.signInError(error)))
  }

export const signInSuccess = (result) =>
  (dispatch, getState) => {
    dispatch(authActions.signInSuccess(result))
  }

export const signOut = () =>
  dispatch => {
    firebaseAuth.signOut().then(() => dispatch(authActions.signOutSuccess()))
  }
