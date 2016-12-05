import * as I from 'immutable'
import reducerFactory from '../../redux/reducer-factory'
import {
  SHARE_DROPDOWN_TOGGLE,
  SIDE_PANEL_TOGGLE,
  USER_PAGE_NAVIGATION
} from '../actions/app-action-types.js'

const initialAppState = I.Map({})
export const app = reducerFactory(initialAppState, {
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
  }
})
