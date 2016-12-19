import { observeStore } from '../redux/observe-store'
import diff from 'immutablediff'
import * as firebaseRepository from '../firebase/firebase-repository'
import { diffsToFirebaseUpdate } from '../firebase/firebase-immutable-diff'
import * as userPageSelectors from '../userpage/userpage-selectors'
import * as I from 'immutable'

export const observerUserPageStore = (store) => {
  return observeStore(store, (state) => state.userPages, userPagesStateChanged)
}

function userPagesStateChanged (state, currentUserPagesState, nextUserPagesState) {
  if (currentUserPagesState === undefined) {
    // a bit of a hack right now to get around posting updates to FB when the tree is getting initialized
    return
  }

  const userPagesDiff = diff(currentUserPagesState, nextUserPagesState)
  const firebaseUpdates = diffsToFirebaseUpdate(
    'userPages',
    userPagesDiff,
    { add: onUserPageAdd.bind(null, state) },
  )

  if (Object.keys(firebaseUpdates).length > 0) {
    firebaseRepository.sync(firebaseUpdates)
  }
}

const onUserPageAdd = (state, updates, diffPath) => {
  const userPageId = diffPath.split('/')[1]
  const userId = state.auth.get('id')
  updates[`userpagesByUser/${userId}/${userPageId}`] = true

  return updates
}
