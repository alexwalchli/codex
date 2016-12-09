import { observeStore } from '../redux/observe-store'
import diff from 'immutablediff'
import * as nodeRepository from './node-repository'
import { diffsToFirebaseUpdate } from '../firebase/firebase-immutable-diff'
import * as userPageSelectors from '../userpage/userpage-selectors'
import * as I from 'immutable'

export const observeTreeStore = (store) => {
  return observeStore(store, (state) => state.tree, treeStateChanged)
}

function treeStateChanged (state, currentTreeState, nextTreeState) {
  if(currentTreeState === undefined) {
    // a bit of a hack right now to get around posting updates to FB when the tree is getting initialized
    return
  }

  const treeDiff = diff(currentTreeState, nextTreeState)
  const firebaseUpdates = diffsToFirebaseUpdate(
    'nodes',
    treeDiff,
    { add: onNodeAdd.bind(null, state) }
  )

  if (Object.keys(firebaseUpdates).length > 0) {
    nodeRepository.sync(firebaseUpdates)
  }
}

const onNodeAdd = (state, updates, diffPath) => {
  const nodeId = diffPath.split('/')[1]
  const userPageId = userPageSelectors.currentPage(state).get('id')
  const userId = state.auth.get('id')
  updates[`userPage_users_nodes/${userPageId}/${userId}/${nodeId}`] = true
  return updates
}