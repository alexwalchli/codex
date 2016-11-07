import * as nodeFirebaseSubscriptions from '../../node/actions/node-firebase-subscriptions'
import * as appActions from './app-actions'

export const togglePagesSidePanel = () =>
  (dispatch, getState) => {
    dispatch(appActions.sidePanelToggled())
  }

export const navigateToUserPage = (userPageId) =>
  (dispatch, getState) => {
    dispatch(appActions.navigatedToUserPage(userPageId))
    dispatch(nodeFirebaseSubscriptions.subscribeToNodes())
  }
