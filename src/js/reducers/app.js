import { SIDE_PANEL_TOGGLED, NAVIGATED_TO_USER_PAGE, TOGGLE_SHARE_DROPDOWN }
    from '../actions/app'

export function app (state = {}, action) {
  switch (action.type) {
    case TOGGLE_SHARE_DROPDOWN:
      return Object.assign({}, state, {
        shareDropdownVisible: !state.shareDropdownVisible
      })
    case SIDE_PANEL_TOGGLED:
      return Object.assign({}, state, {
        pagesSidePanelVisible: !state.pagesSidePanelVisible
      })
    case NAVIGATED_TO_USER_PAGE:
      return Object.assign({}, state, {
        currentUserPageId: action.payload.userPageId
      })
    default:
      return Object.assign({}, state)
  }
}
