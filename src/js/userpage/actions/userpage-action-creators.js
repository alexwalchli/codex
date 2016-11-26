/* global confirm */

import * as appActions from '../../app/actions/app-actions'
import nodeFactory from '../../node/helpers/node-factory'
import nodeRepository from '../../node/repositories/node-repository'
import userPageFactory from '../helpers/userpage-factory'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as userPageActions from './userpage-actions'
import * as userPageRepository from '../repositories/userpage-repository'

export const createUserPage = (title) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeRepository.getNewNodeId()
    const firstNodeId = nodeRepository.getNewNodeId()
    const newUserPageId = nodeRepository.getNewNodeId()

    const newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', state.auth.id)
    const newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], '', state.auth.id)
    const newUserPage = userPageFactory(newUserPageId, rootNodeId, state.auth.id)

    userPageRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
      .then(snapshot => {
        dispatch(appActions.navigateToUserPage(newUserPageId))
      })
  }

export const initializeUserHomePage = () =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeRepository.getNewNodeId()
    const firstNodeId = nodeRepository.getNewNodeId()
    const homeUserPageId = userPageRepository.getNewUserPageId()

    const newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', state.auth.id)
    const newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], '', state.auth.id)
    const newUserPage = userPageFactory(homeUserPageId, rootNodeId, state.auth.id, 'Home', true)

    userPageRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
      .then(snapshot => {
        dispatch(appActions.navigateToUserPage(homeUserPageId))
      })
  }

export const deleteUserPage = (userPageId) =>
  (dispatch, getState) => {
    if (confirm('Are you sure?')) {
      const state = getState()
      const userPage = state.userPages[userPageId]
      const rootNode = state.nodes[userPage.rootNodeId]
      const auth = state.auth

      userPageRepository.deleteUserPage(userPage, rootNode, auth)
      dispatch(appActions.navigateToUserPage(nodeSelectors.dictionaryToArray(state.userPages).find(u => u.isHome).id))
      dispatch(userPageActions.userPageDeletion(userPageId))
    }
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
    const allDescendantIds = nodeSelectors.getAllDescendantIds(nodeSelectors.getPresentNodes(state), userPage.rootNodeId)

    userPageRepository.shareUserPage(userPage, allDescendantIds, emailsArr, state.auth)
  }
