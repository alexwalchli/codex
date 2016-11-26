import { firebaseAuth } from '../../firebase'
import * as userPageRepository from '../../userpage/repositories/userpage-repository'
import * as userPageSubscriptions from '../../userpage/subscriptions/userpage-subscriptions'
import * as authActions from '../../auth/actions/auth-actions'

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

