import * as nodeSubscriptions from '../node/node-subscriptions'
import * as nodeActions from '../node/node-actions'
import * as nodeSelectors from '../node/node-selectors'
import * as appActions from './app-actions'

export const navigateToUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.auth.get('id')
    dispatch(appActions.userPageNavigation(userPageId))
    nodeSubscriptions.initializeNodeSubscriptions(userPageId, userId)
      .then(initialTreeState => {
        dispatch(nodeActions.initialTreeStateLoad(nodeSelectors.getRootNodeId(getState()), initialTreeState, userId))
        dispatch(appActions.appInitializationSuccess())
      })
  }

export const togglePagesSidePanel = () =>
  (dispatch, getState) => {
    dispatch(appActions.sidePanelToggle())
  }
