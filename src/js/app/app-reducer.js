import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  APP_INITIALIZATION_SUCCESS,
  SHARE_DROPDOWN_TOGGLE,
  SIDE_PANEL_TOGGLE,
  USER_PAGE_NAVIGATION
} from './app-action-types'
import {
  NODE_FOCUS
} from '../node/node-action-types'

const initialAppState = I.Map({})
export const app = reducerFactory(initialAppState, {
  [APP_INITIALIZATION_SUCCESS]: (state, action) => {
    return state.merge({
      appInitialized: true
    })
  },
  [SHARE_DROPDOWN_TOGGLE]: (state, action) => {
    return state.merge({
      shareDropdownVisible: !state.shareDropdownVisible
    })
  },
  [SIDE_PANEL_TOGGLE]: (state, action) => {
    return state.merge({
      pagesSidePanelVisible: !state.pagesSidePanelVisible
    })
  },
  [USER_PAGE_NAVIGATION]: (state, action) => {
    return state.merge({
      currentUserPageId: action.payload.userPageId
    })
  },
  [NODE_FOCUS]: (state, action) => {
    return state.merge({
      currentlyFocusedNodeId: action.payload.nodeId,
      lastAnchorPosition: action.payload.anchorPosition
    })
  },
})
