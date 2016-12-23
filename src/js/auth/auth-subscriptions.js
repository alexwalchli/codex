import { firebaseAuth } from '../firebase'
import * as userPageSubscriptions from '../userpage/userpage-subscriptions'
import * as authActions from './auth-actions'

export function subscribeToAuthStateChanged (dispatch) {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(
      user => {
        dispatch(authActions.updateAuthState(user))
        if (user) {
          dispatch(userPageSubscriptions.subscribeToUserPages())
        }
      },
      error => reject(error)
    )
  })
}

