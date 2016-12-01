import nodeSnapshotUnwrapper from '../helpers/node-snapshot-unwrapper'
import { firebaseDb } from '../../firebase'
import { queuedRequest } from '../../requestqueue/queued-request'
export const getNode = (nodeId) => {
  return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(nodeSnapshotUnwrapper)
}

export const getNewNodeId = () => {
  return firebaseDb.ref('nodes').push().key
}

export const createNode = queuedRequest((node, userPageId, updatedParentChildIds) => {
  return firebaseDb.ref('node_userPages_users/' + node.parentId).once('value').then(parentNodeUserPagesUsersSnapshot => {
    const parentNodeUserPagesUsers = parentNodeUserPagesUsersSnapshot.val()
    const nodeUpdates = {
      [`nodes/${node.id}`]: filterOutUserSpecificAttributes(node),
      [`nodes/${node.parentId}/childIds`]: updatedParentChildIds,
      [`nodes/${node.parentId}/lastUpdatedById`]: node.createdById
    }

    Object.keys(parentNodeUserPagesUsers).forEach(userPageId => {
      Object.keys(parentNodeUserPagesUsers[userPageId]).forEach(userId => {
        nodeUpdates[`node_users/${node.id}/${userId}`] = true
        nodeUpdates[`node_userPages_users/${node.id}/${userPageId}/${userId}`] = true
        nodeUpdates[`userPage_users_nodes/${userPageId}/${userId}/${node.id}`] = true
      })
    })

    return firebaseDb.ref().update(nodeUpdates)
  })
})

export const updateNode = queuedRequest((node) => {
  const nodeRef = firebaseDb.ref(`nodes/${node.id}`)
  return nodeRef.update(filterOutUserSpecificAttributes(node))
})

export const updateNodes = queuedRequest((nodes) => {
  const nodeUpdates = nodes.reduce((acc, node) => {
    acc[`nodes/${node.id}`] = filterOutUserSpecificAttributes(node)
    return acc
  }, {})

  return firebaseDb.ref().update(nodeUpdates)
})

function filterOutUserSpecificAttributes(node){
  delete node.focused
  delete node.notesFocused
  return node
}

// export const updateNodeComplete = queuedRequest((nodeId, complete, userId) => {
//   return firebaseDb.ref().update({
//     [`nodes/${nodeId}/completed`]: complete,
//     [`nodes/${nodeId}/lastUpdatedById`]: userId
//   })
// })

// export const updateNodeNotes = queuedRequest((nodeId, notes, userId) => {
//   return firebaseDb.ref().update({
//     [`nodes/${nodeId}/notes`]: notes,
//     [`nodes/${nodeId}/lastUpdatedById`]: userId
//   })
// })

// export function updateNodeDisplayMode (nodeId, mode, userId) {
//   return firebaseDb.ref().update({
//     [`nodes/${nodeId}/displayMode`]: mode,
//     [`nodes/${nodeId}/lastUpdatedById`]: userId
//   })
// }

// export const updateNodeSelectedByUser = queuedRequest((nodeId, userId, userDisplayName) => {
//   let dbUpdates = {
//     [`nodes/${nodeId}/currentlySelectedById`]: userId,
//     [`nodes/${nodeId}/currentlySelectedBy`]: userDisplayName
//   }

//   return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
//     if (snapshot.val()) {
//       return firebaseDb.ref().update(dbUpdates)
//     }

//     return Promise.resolve()
//   })
// })

// export const updateNodeContent = queuedRequest((nodeId, newContent, userId) => {
//   let dbUpdates = {
//     [`nodes/${nodeId}/content`]: newContent,
//     [`nodes/${nodeId}/lastUpdatedById`]: userId
//   }
//   return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
//     if (snapshot.val()) {
//       return firebaseDb.ref().update(dbUpdates)
//     }
//     return Promise.resolve()
//   })
// })

export const deleteNode = queuedRequest((nodeId, parentId, updatedParentChildIds, allDescendantIdsOfNode, userId) => {
  let dbUpdates = {
    [`nodes/${nodeId}/deleted`]: true,
    [`nodes/${nodeId}/lastUpdatedById/`]: userId,
    [`nodes/${parentId}/childIds/`]: updatedParentChildIds,
    [`nodes/${parentId}/lastUpdatedById/`]: userId
  }

  allDescendantIdsOfNode.forEach(descedantId => {
    dbUpdates[`nodes/${descedantId}/deleted`] = true
    dbUpdates[`nodes/${descedantId}/lastUpdatedById/`] = userId
  })

  return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
    if (snapshot.val()) {
      return firebaseDb.ref().update(dbUpdates)
    }

    return Promise.resolve()
  })
})

// TODO: In order to support undo functionality there's a delete flag on nodes
// but we'll need to clean up eventually 
export const permanentlyDeleteNode = queuedRequest((nodeId, userPageId, userId) => {
  const removal = {
    [`nodes/${nodeId}`]: null,
    [`node_users/${nodeId}/${userId}`] : null,
    [`node_userPages_users/${nodeId}/${userPageId}/${userId}`]: null,
    [`userPage_users_nodes/${userPageId}/${userId}/${nodeId}`]: null
  }

  return firebaseDb.ref().update(removal)
})

// TODO:
// export const deleteNodes = queuedRequest((nodesToDelete = [], userId) => {
//   let dbUpdates = {}
//   nodesToDelete.forEach(nodeToDelete => {
//     dbUpdates[`nodes/${nodeToDelete.id}/deleted`] = true
//     dbUpdates[`nodes/${nodeToDelete.id}/lastUpdatedById/`] = userId
//     dbUpdates[`nodes/${nodeToDelete.parentId}/childIds/`] = nodesToDelete.parentNode
//     dbUpdates[`nodes/${nodeToDelete.parentId}/lastUpdatedById/`] = userId

//     nodeToDelete.allDescendentIds.forEach(descedantId => {
//       dbUpdates[`nodes/${descedantId}/deleted`] = true
//       dbUpdates[`nodes/${descedantId}/lastUpdatedById/`] = userId
//     })
//   })

//   return firebaseDb.ref().update(dbUpdates)
// })

// export const completeNodes = queuedRequest((nodeIds, userId) => {
//   let dbUpdates = {}
//   nodeIds.forEach(nodeId => {
//     dbUpdates[`nodes/${nodeId}/completed`] = true
//   })

//   return firebaseDb.ref().update(dbUpdates)
// })

export const reassignParentNode = queuedRequest((nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, userId) => {
  // NOTE: This is assuming that specific nodes within a userPage are not shared. If that happens this will need to account for other users having access
  // to the new parent or not and updating the other many to many indices if necessary.
  let dbUpdates = {}
  dbUpdates[`nodes/${nodeId}/parentId`] = newParentId
  dbUpdates[`nodes/${nodeId}/lastUpdatedById`] = userId

  dbUpdates[`nodes/${oldParentId}/childIds`] = updatedChildIdsForOldParent
  dbUpdates[`nodes/${oldParentId}/lastUpdatedById`] = userId

  dbUpdates[`nodes/${newParentId}/childIds`] = updatedChildIdsForNewParent
  dbUpdates[`nodes/${newParentId}/lastUpdatedById`] = userId

  return firebaseDb.ref(`nodes/${nodeId}`).once(`value`).then(snapshot => {
    if (snapshot.val()) {
      return firebaseDb.ref().update(dbUpdates)
    }

    return Promise.resolve()
  })
})

// export const collapseNode = queuedRequest((nodeId, userId) => {
//   return firebaseDb.ref().update({
//     [`nodes/${nodeId}/collapsedBy/${userId}/`]: true
//   })
// })

// export const expandNode = queuedRequest((nodeId, userId) => {
//   return firebaseDb.ref().update({
//     [`nodes/${nodeId}/collapsedBy/${userId}/`]: false
//   })
// })
