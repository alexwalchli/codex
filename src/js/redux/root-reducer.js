import { combineReducers } from 'redux'
import { app } from '../app/app-reducer'
import { tree } from '../node/tree-reducer'
import { visibleNodes } from '../node/visible-nodes-reducer'
import { auth } from '../auth/auth-reducer'
import { userPages } from '../userpage/userpage-reducer'
import { tags } from '../tag/tag-reducer'
import { search } from '../search/search-reducer'
// import undoable from 'redux-undo'

// const undoableActionFilter = action => action.undoable !== false
// const undoableTree = undoable(tree, {
//   filter: undoableActionFilter
// })
// const undoableVisibleNodes = undoable(visibleNodes, {
//   filter: undoableActionFilter
// })

const rootReducer = combineReducers({
  app,
  auth,
  tree,
  visibleNodes,
  userPages,
  tags,
  search
})

export default rootReducer

