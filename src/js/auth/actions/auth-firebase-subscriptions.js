import { firebaseAuth } from '../../firebase'
import * as userPageFirebaseActions from '../../userpage/actions/userpage-firebase-actions'
import * as userPageFirebaseSubscription from '../../userpage/actions/userpage-firebase-subscriptions'
import * as authActions from '../../auth/actions/auth-actions'

export function subscribeToAuthStateChanged (dispatch) {
  return new Promise((resolve, reject) => {
    firebaseAuth.onAuthStateChanged(
      user => {
        dispatch(authActions.updateAuthState(user))
        if (user) {
          userPageFirebaseActions.createEmailUser(user.email, user.uid)
          dispatch(userPageFirebaseSubscription.subscribeToUserPages())
        }
      },
      error => reject(error)
    )
  })
}

