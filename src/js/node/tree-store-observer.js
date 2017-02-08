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
  if (currentTreeState === undefined) {
    // a bit of a hack right now to get around posting updates to FB when the tree is getting initialized
    return
  }

  const treeDiff = diff(currentTreeState.present, nextTreeState.present)
  const firebaseUpdates = diffsToFirebaseUpdate(
    'nodes',
    treeDiff,
    {
      // only call onNodeAddOrRemove for the /{nodeId} path and not anything deeper in the heirarchy, ex: /{nodeId}/childIDs
      add: { predicate: (path) => path.split('/').length === 2, callback: onNodeAddOrRemove.bind(null, state, true) },
      remove: { predicate: (path) => path.split('/').length === 2, callback: onNodeAddOrRemove.bind(null, state, false) }
    },
    I.Map({
      childIds: onChildIdsUpdate.bind(null, state)
    }),
    I.Map({ focused: true })
  )

  if (Object.keys(firebaseUpdates).length > 0) {
    nodeRepository.sync(firebaseUpdates)
  }
}

const onNodeAddOrRemove = (state, add, updates, diffPath) => {
  const nodeId = diffPath.split('/')[1]
  const userPageId = userPageSelectors.currentPage(state).get('id')
  updates[`nodesByUserPage/${userPageId}/${nodeId}`] = add ? true : null

  return updates
}

const onChildIdsUpdate = (state, updates, diffPath) => {
  // firebase doesn't allow deleting specific items from an array with a multi update
  // so we'll need to just replace the whole array
  const nodeId = diffPath.split('/')[1]
  const childIdsPath = diffPath.substring(0, diffPath.lastIndexOf('/'))
  const updatedChildIds = state.tree.present.getIn([nodeId, 'childIds']).toJS()
  updates[childIdsPath] = updatedChildIds
  return updates
}
