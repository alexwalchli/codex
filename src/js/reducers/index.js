import { combineReducers } from 'redux'
import { externalDataCache, selectedDataSource } from './external-data-cache'
import { app } from './app'
import { search } from './search'
import { tree } from './tree'
import { nodeVisibility } from './node-visibility'
import { auth } from './auth'
import { userPages } from './user-page'
import { queuedRequests } from './firebase-request-queue'
import undoable from 'redux-undo'

const undoableActionFilter = action => action.undoable !== false
const undoableTree = undoable(tree, {
  filter: undoableActionFilter
})
const undoableNodeVisibility = undoable(nodeVisibility, {
  filter: undoableActionFilter
})

const rootReducer = combineReducers({
  app,
  auth,
  externalDataCache,
  selectedDataSource,
  tree: undoableTree,
  nodeVisibility: undoableNodeVisibility,
  search,
  userPages,
  queuedRequests
})

export default rootReducer

