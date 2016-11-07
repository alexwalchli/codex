import * as appActionTypes from './app-action-types'

export const toggleShareDropdown = () => ({
  type: appActionTypes.TOGGLE_SHARE_DROPDOWN
})

export const sidePanelToggled = () => ({
  type: appActionTypes.SIDE_PANEL_TOGGLED
})

export const navigatedToUserPage = (userPageId) => ({
  type: appActionTypes.NAVIGATED_TO_USER_PAGE,
  payload: {
    userPageId
  }
})

