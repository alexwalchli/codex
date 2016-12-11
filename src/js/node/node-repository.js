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

// function filterOutUserSpecificAttributes (node) {
//   delete node.focused
//   delete node.notesFocused
//   return node
// }

// TODO: In order to support undo functionality there's a delete flag on nodes
// but we'll need to clean up eventually
export const permanentlyDeleteNode = queuedRequest((nodeId, userPageId, userId) => {
  const removal = {
    [`nodes/${nodeId}`]: null,
    [`node_users/${nodeId}/${userId}`]: null,
    [`node_userPages_users/${nodeId}/${userPageId}/${userId}`]: null,
    [`userPage_users_nodes/${userPageId}/${userId}/${nodeId}`]: null
  }

  return firebaseDb.ref().update(removal)
})
