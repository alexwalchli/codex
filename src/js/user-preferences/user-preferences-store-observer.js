import { observeStore } from '../redux/observe-store'
import diff from 'immutablediff'
import * as userPreferencesRepository from './user-preferences-repository'
import { diffsToFirebaseUpdate } from '../firebase/firebase-immutable-diff'

export const observeTreeStore = (store) => {
  return observeStore(store, (state) => state.tree, userPreferencesChanged)
}

function userPreferencesChanged (state, currentUserPreferencesState, nextUserPreferencesState) {
  if (currentUserPreferencesState === undefined) {
    return
  }

  const treeDiff = diff(currentUserPreferencesState, nextUserPreferencesState)
  const firebaseUpdates = diffsToFirebaseUpdate(
    'userPreferences',
    treeDiff
  )

  if (Object.keys(firebaseUpdates).length > 0) {
    userPreferencesRepository.sync(firebaseUpdates)
  }
}
