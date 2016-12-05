import * as nodeSubscriptions from '../../node/subscriptions/node-subscriptions'
import * as nodeActions from '../../node/actions/node-actions'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as appActions from './app-actions'

export const navigateToUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.getIn(['auth', 'id'])
    dispatch(appActions.userPageNavigation(userPageId))
    nodeSubscriptions.initializeNodeSubscriptions(userPageId, userId)
      .then(initialTreeState => {
        dispatch(nodeActions.initialTreeStateLoad(nodeSelectors.getRootNodeId(getState()), initialTreeState, userId))
      })
  }

export const togglePagesSidePanel = () =>
  (dispatch, getState) => {
    dispatch(appActions.sidePanelToggle())
  }
