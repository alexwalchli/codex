import * as appActionCreators from '../../app/app-action-creators'
import * as nodeRepository from '../../node/node-repository'
import * as nodeSelectors from '../../node/node-selectors'
import * as userPageActions from './userpage-actions'
import * as userPageOperations from '../userpage-operations'
import * as userPageRepository from '../repositories/userpage-repository'
import * as nodeOperations from '../../node/node-operations'

export const createUserPage = (title, isHomePage) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.auth.get('id')
    const rootNodeId = nodeRepository.getNewNodeId()
    const firstNodeId = nodeRepository.getNewNodeId()
    const newUserPageId = userPageRepository.getNewUserPageId()
    const newRootNode = nodeOperations.makeNode(rootNodeId, null, [ firstNodeId ], '', userId)
    const newFirstNode = nodeOperations.makeNode(firstNodeId, rootNodeId, [], '', userId)
    const newUserPage = userPageOperations.makeUserPage(newUserPageId, rootNodeId, userId, title, isHomePage)

    userPageRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
      .then(snapshot => {
        dispatch(appActionCreators.navigateToUserPage(newUserPageId))
      })
  }

export const deleteUserPage = (userPageId) =>
  (dispatch, getState) => {
    const state = getState()
    const userPage = state.userPages.get(userPageId)
    const rootNode = state.tree.get(userPage.get('rootNodeId'))
    const auth = state.auth

    dispatch(appActionCreators.navigateToUserPage(state.userPages.find(u => u.get('isHome')).get('id')))
    dispatch(userPageActions.userPageDeletion(userPageId))

    userPageRepository.deleteUserPage(userPage, rootNode, auth)
  }

export const updateUserPageName = (userPageId, newUserPageName) =>
  (dispatch, getState) => {
    const state = getState()
    userPageRepository.updateUserPageName(state.userPages.get(userPageId), newUserPageName)
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
