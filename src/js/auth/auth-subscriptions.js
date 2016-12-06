import { firebaseAuth } from '../firebase'
import * as userPageRepository from '../userpage/userpage-repository'
import * as userPageSubscriptions from '../userpage/userpage-subscriptions'
import * as authActions from './auth-actions'

export function subscribeToAuthStateChanged (dispatch) {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(
      user => {
        dispatch(authActions.updateAuthState(user))
        if (user) {
          userPageRepository.createEmailUser(user.email, user.uid)
          dispatch(userPageSubscriptions.subscribeToUserPages())
        }
      },
      error => reject(error)
    )
  })
}

