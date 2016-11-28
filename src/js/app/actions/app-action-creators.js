import * as nodeSubscriptions from '../../node/subscriptions/node-subscriptions'
import * as nodeActions from '../../node/actions/node-actions'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as appActions from './app-actions'

export const navigateToUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    dispatch(appActions.userPageNavigation(userPageId))
    nodeSubscriptions.initializeNodeSubscriptions(userPageId, state.auth.id)
      .then(initialTreeState => {
        dispatch(nodeActions.initialTreeStateLoad(nodeSelectors.getRootNodeId(state), initialTreeState, state.auth.id))
      })
  }

export const togglePagesSidePanel = () =>
  (dispatch, getState) => {
    dispatch(appActions.sidePanelToggle())
  }
