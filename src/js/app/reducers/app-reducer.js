import reducerFactory from '../../redux/reducer-factory'
import {
  SHARE_DROPDOWN_TOGGLE,
  SIDE_PANEL_TOGGLE,
  USER_PAGE_NAVIGATION
} from '../actions/app-action-types.js'

export const app = reducerFactory({}, {
  [SHARE_DROPDOWN_TOGGLE]: (state, action) => {
    return Object.assign({}, state, {
      shareDropdownVisible: !state.shareDropdownVisible
    })
  },
  [SIDE_PANEL_TOGGLE]: (state, action) => {
    return Object.assign({}, state, {
      pagesSidePanelVisible: !state.pagesSidePanelVisible
    })
  },
  [USER_PAGE_NAVIGATION]: (state, action) => {
    return Object.assign({}, state, {
      currentUserPageId: action.payload.userPageId
    })
  }
})
