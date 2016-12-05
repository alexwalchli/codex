import * as appActionCreators from '../../app/actions/app-action-creators'
import * as nodeRepository from '../../node/repositories/node-repository'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as userPageActions from './userpage-actions'
import * as userPageRepository from '../repositories/userpage-repository'
import * as nodeOperations from '../../node/operations/node-operations'
import UserPageRecord from '../userpage-record'

export const createUserPage = (title, isHomePage) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.getIn(['auth', 'id'])
    const rootNodeId = nodeRepository.getNewNodeId()
    const firstNodeId = nodeRepository.getNewNodeId()
    const newUserPageId = userPageRepository.getNewUserPageId()
    // const newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', state.auth.id)
    const newRootNode = nodeOperations.create(rootNodeId, null, [ firstNodeId ], '', userId)
    // const newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], '', state.auth.id)
    const newFirstNode = nodeOperations.create(firstNodeId, rootNodeId, [], '', userId)

    const newUserPage = new UserPageRecord({
      id: newUserPageId,
      rootNodeId,
      createdById: userId,
      title,
      isHomePage
    })

    userPageRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
      .then(snapshot => {
        dispatch(appActionCreators.navigateToUserPage(newUserPageId))
      })
  }

export const deleteUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    const userPage = state.userPages[userPageId]
    const rootNode = state.tree.present[userPage.rootNodeId]
    const auth = state.auth

    dispatch(appActionCreators.navigateToUserPage(nodeSelectors.dictionaryToArray(state.userPages).find(u => u.isHome).id))
    dispatch(userPageActions.userPageDeletion(userPageId))

    userPageRepository.deleteUserPage(userPage, rootNode, auth)
  }

export const updateUserPageName = (userPageId, newUserPageName) =>
  (dispatch, getState) => {
    const state = getState()
    userPageRepository.updateUserPageName(state.userPages[userPageId], newUserPageName)
    dispatch(userPageActions.userPageNameUpdate(userPageId, newUserPageName))
  }

export const shareUserPage = (userPageId, emails) =>
  (dispatch, getState) => {
    if (!emails) {
      return
    }

    const state = getState()
    const emailsArr = emails.split(',')
    const userPage = state.userPages[userPageId]
    const allDescendantIds = nodeSelectors.getAllDescendantIds(nodeSelectors.currentTreeState(state), userPage.rootNodeId)

    userPageRepository.shareUserPage(userPage, allDescendantIds, emailsArr, state.auth)
  }
