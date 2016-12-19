import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'

export const sync = queuedRequest((diffs) => {
  return firebaseDb.ref().update(diffs)
})