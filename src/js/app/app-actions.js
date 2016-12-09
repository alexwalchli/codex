import * as appActionTypes from './app-action-types'

export const appInitializationSuccess = () => ({
  type: appActionTypes.APP_INITIALIZATION_SUCCESS
})

export const shareDropdownToggle = () => ({
  type: appActionTypes.SHARE_DROPDOWN_TOGGLE
})

export const sidePanelToggle = () => ({
  type: appActionTypes.SIDE_PANEL_TOGGLE
})

export const userPageNavigation = (userPageId) => ({
  type: appActionTypes.USER_PAGE_NAVIGATION,
  payload: {
    userPageId
  }
})

