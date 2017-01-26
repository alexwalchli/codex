import * as appActions from './app-actions'
import * as nodeSubscriptions from '../node/node-subscriptions'
import * as nodeActions from '../node/node-actions'
import * as nodeSelectors from '../node/node-selectors'
import * as userPreferencesActions from '../user-preferences/user-preferences-actions'
import * as userPreferencesRepository from '../user-preferences/user-preferences-repository'

export const navigateToUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.auth.get('id')
    dispatch(appActions.userPageNavigation(userPageId))
    userPreferencesRepository.get(userId).then((userPreferences) => {
      nodeSubscriptions.initializeNodeSubscriptions(userPageId, userId)
        .then(initialTreeState => {
          dispatch(nodeActions.initialTreeStateLoad(nodeSelectors.getRootNodeId(getState()), initialTreeState, userId))
          dispatch(userPreferencesActions.initialLoad(userPreferences))
          dispatch(appActions.appInitializationSuccess())
        })
    })
  }

export const togglePagesSidePanel = () =>
  (dispatch, getState) => {
    dispatch(appActions.sidePanelToggle())
  }
