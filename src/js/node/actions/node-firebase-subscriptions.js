import { firebaseDb } from '../../firebase'
import * as userPageFirebaseSubscriptions from '../../userpage/actions/userpage-firebase-subscriptions'
import * as nodeActionTypes from './node-action-types'
import * as nodeActions from './node-actions'
import * as nodeSelectors from '../selectors/node-selectors'

let initialized = false

export function subscribeToNodes () {
  return (dispatch, getState) => {
        // do an initial load of the user's nodes based on the current user page's descendantIds
        // and then subscribe to changes on each node
    let appState = getState()
    let initialTreeState = {}
    let initialNodePromises = []

    // collection of all node Ids for this userPage and user
    let userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id)
    userPageUserNodesRef.once('value').then(userPageUsersNodesSnapshot => {
      let nodeIds = Object.keys(userPageUsersNodesSnapshot.val())

      dispatch(userPageFirebaseSubscriptions.subscribeToUserPageUserNodes(appState.app.currentUserPageId))

      // retrieve all nodes and then subscribe to each
      nodeIds.forEach(descendantId => {
        let nodeRef = firebaseDb.ref('nodes/' + descendantId)
        let nodePromise = new Promise((resolve, reject) => {
          nodeRef.once('value').then(snapshot => {
            let node = unwrapNodeSnapshot(snapshot)

            initialTreeState[descendantId] = node
            dispatch(subscribeToNode(node.id))

            resolve()
          })
        })
        initialNodePromises.push(nodePromise)
      })

      Promise.all(initialNodePromises).then(() => {
        dispatch({
          type: nodeActionTypes.INITIAL_NODE_STATE_LOADED,
          payload: {
            rootNodeId: appState.userPages[appState.app.currentUserPageId].rootNodeId,
            initialTreeState,
            userId: appState.auth.id
          }
        })

        initialized = true
      })
    })
  }
}

export function subscribeToNode (nodeId) {
  return (dispatch, getState) => {
    const nodeRef = firebaseDb.ref('nodes/' + nodeId)
    const nodeChildIdsRef = firebaseDb.ref('nodes/' + nodeId + '/childIds')

    nodeRef.on('value', snapshot => {
      const appState = getState()
      const updatedNode = unwrapNodeSnapshot(snapshot)

      if (initialized && updatedNode) {
        let nodeWasJustCreatedButNotByCurrentUser = updatedNode.lastUpdatedById === undefined && updatedNode.createdById !== appState.auth.id
        let nodeWasNotUpdatedByCurrentUser = updatedNode.lastUpdatedById !== appState.auth.id

        if (nodeWasJustCreatedButNotByCurrentUser && nodeWasNotUpdatedByCurrentUser) {
          dispatch(nodeActions.nodeUpdated(updatedNode))
        }
      }
    })

    nodeChildIdsRef.on('child_added', snapshot => {

    })

    nodeChildIdsRef.on('child_removed', snapshot => {
      let nodeExistsInAppState = nodeSelectors.getPresentNodes(getState())[snapshot.key]
      if (initialized && nodeExistsInAppState) {
        dispatch(nodeActions.nodesDeleted([snapshot.key]))
      }
    })
  }
}

function unwrapNodeSnapshot (nodeSnapshot) {
  let node = nodeSnapshot.val()
  node.childIds = node.childIds || []
  node.collapsedBy = node.collapsedBy || {}
  node.taggedByIds = node.taggedByIds || []

  return node
}
