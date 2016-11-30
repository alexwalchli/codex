import * as userPageActions from '../../userpage/actions/userpage-actions'
import * as userPageActionCreators from '../../userpage/actions/userpage-action-creators'
import * as appActionCreators from '../../app/actions/app-action-creators'
import * as userPageRepository from '../repositories/userpage-repository'
import { firebaseDb } from '../../firebase'

export function subscribeToUserPages () {
  return (dispatch, getState) => {
    const state = getState()
    userPageRepository.getUserPages(state.auth.id).then(userPages => {
      if (!userPages || userPages.length === 0) {
        dispatch(userPageActionCreators.createUserPage('Home', true))
      } else {
        userPages.forEach(userPage => {
          dispatch(userPageActions.userPageCreation(userPage))
        })

        dispatch(appActionCreators.navigateToUserPage(userPages.find(u => u.isHome).id))
      }

      firebaseDb.ref('userPages/' + state.auth.id).on('child_added', snapshot => onUserPageCreated(snapshot, dispatch))
    })
  }
}

function onUserPageCreated (snapshot, dispatch) {
  dispatch(userPageActions.userPageCreation(snapshot.val()))
}
