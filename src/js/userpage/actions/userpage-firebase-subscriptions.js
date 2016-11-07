import * as nodeActions from '../../node/actions/node-actions'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as nodeFirebaseActions from '../../node/actions/node-firebase-actions'
import * as nodeFirebaseSubscriptions from '../../node/actions/node-firebase-subscriptions'
import * as userPageActions from '../../userpage/actions/userpage-actions'
import * as appActionCreators from '../../app/actions/app-action-creators'
import { firebaseDb } from '../../firebase'

let initialized = false

export function subscribeToUserPages () {
  return (dispatch, getState) => {
    let appState = getState()
    firebaseDb.ref('userPages/' + appState.auth.id).once('value').then(snapshot => {
      var userPages = nodeSelectors.dictionaryToArray(snapshot.val())
      if (!userPages || userPages.length === 0) {
        dispatch(userPageActions.initializeUserHomePage())
      } else {
        userPages.forEach(userPage => {
          dispatch(userPageActions.userPageCreated(userPage))
        })

        dispatch(appActionCreators.navigateToUserPage(userPages.find(u => u.isHome).id))
      }

      firebaseDb.ref('userPages/' + appState.auth.id).on('child_added', snapshot => {
        dispatch(userPageActions.userPageCreated(snapshot.val()))
      })
    })
  }
}

export function subscribeToUserPageUserNodes (userPageId) {
  return (dispatch, getState) => {
    const appState = getState()
    const userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id)

    userPageUserNodesRef.on('child_added', snapshot => {
      let nodeId = snapshot.key
      let nodeDoesNotExistsInAppState = !nodeSelectors.getPresentNodes(getState())[nodeId]
      if (initialized && nodeDoesNotExistsInAppState) {
        nodeFirebaseActions.getNodeSnapshot(nodeId).then(node => {
          dispatch(nodeFirebaseSubscriptions.subscribeToNode(nodeId))
          dispatch(nodeActions.nodeCreated(node))
        })
      }
    })

    userPageUserNodesRef.on('child_removed', snapshot => {
      let nodeId = snapshot.key
      let nodeDoesNotExistsInAppState = !nodeSelectors.getPresentNodes(getState())[nodeId]
      if (initialized && nodeDoesNotExistsInAppState) {
        dispatch(nodeActions.nodesDeleted([nodeId]))
      }
    })
  }
}
