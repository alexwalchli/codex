import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'

export const sync = queuedRequest((diffs) => {
  return firebaseDb.ref().update(diffs)
})

export const get = queuedRequest((userId) => {
  return firebaseDb.ref(`userPreferences/${userId}`).once('value')
    .then((userPreferencesSnapshot) => {
      return userPreferencesSnapshot.val()
    })
})
