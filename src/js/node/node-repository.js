import nodeSnapshotUnwrapper from './node-snapshot-unwrapper'
import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'

export const getNode = (nodeId) => {
  return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(nodeSnapshotUnwrapper)
}

export const getNewNodeId = () => {
  return firebaseDb.ref('nodes').push().key
}

export const sync = queuedRequest((diffs) => {
  return firebaseDb.ref().update(diffs)
})

export const permanentlyDeleteNode = queuedRequest((nodeId, userPageId, userId) => {
  const removal = {
    [`nodes/${nodeId}`]: null,
    [`userpage_nodes/${userPageId}/${nodeId}`]: null
  }

  return firebaseDb.ref().update(removal)
})
