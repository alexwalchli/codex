import * as userPageActions from './userpage-actions'
import * as userPageActionCreators from './userpage-action-creators'
import * as appActionCreators from '../app/app-action-creators'
import * as userPageRepository from './userpage-repository'

export function subscribeToUserPages () {
  return (dispatch, getState) => {
    const state = getState()
    const userId = state.auth.get('id')
    userPageRepository.getUserPages(userId).then(userPages => {
      if (!userPages) {
        dispatch(userPageActionCreators.createUserPage('Home', true))
      } else {
        userPages.forEach(userPage => {
          dispatch(userPageActions.userPageCreation(userPage))
        })

        dispatch(appActionCreators.navigateToUserPage(userPages.find(u => u.get('isHome')).get('id')))
      }

      // firebaseDb.ref('userPages/' + userId).on('child_added', snapshot => onUserPageCreated(snapshot, dispatch))
    })
  }
}

// function onUserPageCreated (snapshot, dispatch) {
//   dispatch(userPageActions.userPageCreation(snapshot.val()))
// }
