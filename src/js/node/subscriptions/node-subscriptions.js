import { firebaseDb } from '../../firebase'
// import * as nodeActions from '../actions/node-actions'
import * as nodeRepository from '../repositories/node-repository'
import * as userPageUsersNodesRepository from '../../userpage/repositories/userpage-users-nodes-repository'
// import nodeSnapshotUnwrapper from '../helpers/node-snapshot-unwrapper'
// import { dispatch } from 'redux'

// let initialized = false

export const initializeNodeSubscriptions = (userPageId, userId) => {
  return new Promise((resolve, reject) => {
    let initialNodePromises = []

    userPageUsersNodesRepository.getNodeIds(userPageId, userId).then(nodeIds => {
      let initialTreeState = {}

      subscribeToNodeDeletedAndCreated(userPageId, userId)

      nodeIds.forEach(nodeId => {
        let nodePromise = new Promise((resolve, reject) => {
          nodeRepository.getNode(nodeId)
              .then(node => {
                // clean up nodes each time we initialize subs
                if (node.deleted) {
                  nodeRepository.permanentlyDeleteNode(nodeId, userPageId, userId)
                } else {
                  initialTreeState[nodeId] = node
                  subscribeToNodeUpdated(nodeId)
                }
                resolve()
              })
        })
        initialNodePromises.push(nodePromise)
      })

      Promise.all(initialNodePromises).then(() => {
        resolve(initialTreeState)
        // initialized = true
      }).catch(error => {
        console.error('Error while initializing node subscriptions: ' + error.message)
      })
    })
  })
}

export const subscribeToNodeUpdated = (nodeId) => {
  const nodeRef = firebaseDb.ref('nodes/' + nodeId)
  nodeRef.on('value', onNodeUpdated)
}

function subscribeToNodeDeletedAndCreated (userPageId, userId) {
  const userPageUserNodesRef = firebaseDb.ref(`userPage_users_nodes/${userPageId}/${userId}`)
  userPageUserNodesRef.on('child_added', onNodeCreated)
  userPageUserNodesRef.on('child_removed', onNodeDeleted)
}

function onNodeCreated (nodeSnapshot) {
  // TODO:

  // let nodeId = snapshot.key
  // let nodeDoesNotExistsInAppState = !nodeSelectors.currentTreeState(getState())[nodeId]
  // if (initialized && nodeDoesNotExistsInAppState) {
  //   nodeFirebaseActions.getNode(nodeId).then(node => {
  //     subscribeToNode(nodeId)
  //     dispatch(nodeActions.nodeCreated(node))
  //   })
  // }
}

function onNodeUpdated (nodeSnapshot) {
  // const updatedNode = nodeSnapshotUnwrapper.unwrap(nodeSnapshot)

  // dispatch(nodeActions.nodeUpdateFromSubscription(updatedNode))

  // if (initialized && updatedNode) {
  //   let nodeWasJustCreatedButNotByCurrentUser = updatedNode.lastUpdatedById === undefined && updatedNode.createdById !== appState.auth.id
  //   let nodeWasNotUpdatedByCurrentUser = updatedNode.lastUpdatedById !== appState.auth.id

  //   if (nodeWasJustCreatedButNotByCurrentUser && nodeWasNotUpdatedByCurrentUser) {
  //     dispatch(nodeActions.nodeUpdateFromSubscription(updatedNode))
  //   }
  // }
}

function onNodeDeleted (snapshot) {
  // let nodeId = snapshot.key
  // let nodeDoesNotExistsInAppState = !nodeSelectors.currentTreeState(getState())[nodeId]
  // if (initialized && nodeDoesNotExistsInAppState) {
  //   dispatch(nodeActions.nodesDeleted([nodeId]))
  // }

  // let nodeExistsInAppState = nodeSelectors.currentTreeState(getState())[snapshot.key]
  // if (initialized && nodeExistsInAppState) {
  // dispatch(nodeActions.nodeDeletionFromSubscription(snapshot.key))
  // }
}
