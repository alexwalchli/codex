import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  APP_INITIALIZATION_SUCCESS,
  SHARE_DROPDOWN_TOGGLE,
  SIDE_PANEL_TOGGLE,
  USER_PAGE_NAVIGATION
} from './app-action-types'

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
  [USER_PAGE_CREATION]: (state, action) => {
    return state.merge({
      currentUserPageId: action.payload.userPage.id
    })
  }
})
