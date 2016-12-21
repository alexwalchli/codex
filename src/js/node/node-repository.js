import nodeSnapshotUnwrapper from './node-snapshot-unwrapper'
import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'

export const getNode = (nodeId) => {
  return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(nodeSnapshotUnwrapper)
}

export const getNewNodeId = () => {
  return firebaseDb.ref('nodes').push().key
}

export const getNodeIdsByUserPageId = (userPageId) => {
  return firebaseDb.ref(`nodesByUserPage/${userPageId}`).once('value')
    .then(snapshot => {
      return Object.keys(snapshot.val())
    })
}

export const sync = queuedRequest((diffs) => {
  return firebaseDb.ref().update(diffs)
})

export const permanentlyDeleteNode = queuedRequest((nodeId, userPageId, userId) => {
  const removal = {
    [`nodes/${nodeId}`]: null,
    [`nodesByUserPage/${userPageId}/${nodeId}`]: null
  }

  return firebaseDb.ref().update(removal)
})
