import { combineReducers } from 'redux'
import { app } from '../app/reducers/app-reducer'
import { tree } from '../node/reducers/tree-reducer'
import { visibleNodes } from '../node/reducers/visible-nodes-reducer'
import { auth } from '../auth/reducers/auth-reducer'
import { userPages } from '../userpage/reducers/userpage-reducer'
import { tags } from '../tag/reducers/tag-reducer'
import undoable from 'redux-undo'

const undoableActionFilter = action => action.undoable !== false
const undoableTree = undoable(tree, {
  filter: undoableActionFilter
})
const undoableVisibleNodes = undoable(visibleNodes, {
  filter: undoableActionFilter
})

const rootReducer = combineReducers({
  app,
  auth,
  tree: undoableTree,
  visibleNodes: undoableVisibleNodes,
  userPages,
  tags
})

export default rootReducer

