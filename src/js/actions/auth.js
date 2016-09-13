import { firebaseAuth } from '../firebase';
import { subscribeToUserPages } from './user-pages';
import * as dbRepository from '../repositories/database-repository';

export const SUBSCRIBE_TO_AUTH_STATE_CHANGED = 'SUBSCRIBE_TO_AUTH_STATE_CHANGED';
export const UPDATE_AUTH_STATE = 'UPDATE_AUTH_STATE';
export const SIGN_IN_ERROR = 'SIGN_IN_ERROR';
export const SIGN_IN_SUCCESS = 'SIGN_IN_SUCCESS';
export const SIGN_OUT_SUCCESS = 'SIGN_OUT_SUCCESS';

function authenticate(provider) {
  return dispatch => {
    firebaseAuth.signInWithPopup(provider)
      .then(result => dispatch(signInSuccess(result)))
      .catch(error => dispatch(signInError(error)));
  };
}

export function subscribeToAuthStateChanged(dispatch) {
    return new Promise((resolve, reject) => {
        firebaseAuth.onAuthStateChanged(
            user => {
                dispatch(updateAuthState(user));
                if(user){
                    dbRepository.createEmailUser(user.email, user.uid);
                    dispatch(subscribeToUserPages());
                }
            },
            error => reject(error)
        );
    });
}

export function updateAuthState(user) {
  return {
    type: UPDATE_AUTH_STATE,
    payload: user
  };
}

export function signInError(error) {
  return {
    type: SIGN_IN_ERROR,
    payload: error
  };
}

export function signInSuccess(result) {
    return (dispatch, getState) => {
        dispatch({
            type: SIGN_IN_SUCCESS,  
            payload: result.user
        });
    };
}

export function signInWithGithub() {
  return authenticate(new firebase.auth.GithubAuthProvider());
}


export function signInWithGoogle() {
  return authenticate(new firebase.auth.GoogleAuthProvider());
}


export function signInWithTwitter() {
  return authenticate(new firebase.auth.TwitterAuthProvider());
}

export function signOut() {
  return dispatch => {
    firebaseAuth.signOut()
      .then(() => dispatch(signOutSuccess()));
  };
}

export function signOutSuccess() {
  return {
    type: SIGN_OUT_SUCCESS
  };
}