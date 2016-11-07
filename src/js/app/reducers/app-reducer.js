import * as appActionTypes from '../actions/app-action-types'

export function app (state = {}, action) {
  switch (action.type) {
    case appActionTypes.TOGGLE_SHARE_DROPDOWN:
      return Object.assign({}, state, {
        shareDropdownVisible: !state.shareDropdownVisible
      })
    case appActionTypes.SIDE_PANEL_TOGGLED:
      return Object.assign({}, state, {
        pagesSidePanelVisible: !state.pagesSidePanelVisible
      })
    case appActionTypes.NAVIGATED_TO_USER_PAGE:
      return Object.assign({}, state, {
        currentUserPageId: action.payload.userPageId
      })
    default:
      return Object.assign({}, state)
  }
}
