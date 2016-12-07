import { observeStore } from '../redux/observe-store'
import diff from 'immutablediff'

export const observeTreeStore = (store) => {
  observeStore(store, (state) => state.tree, handleTreeStateChanged)
}

function handleTreeStateChanged (currentState, nextState) {
  // TODO: immutable diff
  const treeDiff = diff(currentState, nextState)

  // TODO: build up firebase updates
  // const firebaseUpdates = treeDiff.reduce((updates, nodeDiff) => {
  //   const op = nodeDiff.get('op')
  //   const idPath = nodeDiff.get('path')
  //   if(op === 'add' || op === 'update') {
  //     updates[`nodes${idPath}`] = nodeDiff.get('value').toJS()
  //   } else if (op === 'delete') {
  //     updates[`nodes/${idPath}`] = null
  //   }
  // }, {})
}
