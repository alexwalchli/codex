import { combineReducers } from 'redux'
import { externalDataCache, selectedDataSource } from './external-data-cache'
import { app } from './app'
import { search } from './search'
import { tree } from './tree'
import { auth } from './auth'
import { userPages } from './user-page'
import { queuedRequests } from './firebase-request-queue'
import undoable from 'redux-undo'

const undoableTree = undoable(tree, {
  filter: (action) => {
    return action.undoable !== false
  }
})
const rootReducer = combineReducers({
  app,
  auth,
  externalDataCache,
  selectedDataSource,
  tree: undoableTree,
  search,
  userPages,
  queuedRequests
})

export default rootReducer
