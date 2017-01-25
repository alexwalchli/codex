import { observeStore } from '../redux/observe-store'
import diff from 'immutablediff'
import * as userPreferencesRepository from './user-preferences-repository'
import { diffsToFirebaseUpdate } from '../firebase/firebase-immutable-diff'

export const observeUserPreferencesStore = (store) => {
  return observeStore(store, (state) => state.userPreferences, userPreferencesChanged)
}

function userPreferencesChanged (state, currentUserPreferencesState, nextUserPreferencesState) {
  if (currentUserPreferencesState === undefined) {
    return
  }

  const treeDiff = diff(currentUserPreferencesState, nextUserPreferencesState)
  const firebaseUpdates = diffsToFirebaseUpdate(
    'userPreferences/' + state.auth.get('id'),
    treeDiff
  )

  if (Object.keys(firebaseUpdates).length > 0) {
    userPreferencesRepository.sync(firebaseUpdates)
  }
}
