/* global confirm */

import { firebaseDb } from '../../firebase/'
import * as appActions from '../../app/actions/app-actions'
import nodeFactory from '../../node/helpers/node-factory'
import userPageFactory from '../helpers/userpage-factory'
import * as nodeSelectors from '../../node/selectors/node-selectors'
import * as userPageFirebaseActions from './userpage-firebase-actions'
import * as userPageActions from './userpage-actions'

export const createNewUserPage = (title) =>
  (dispatch, getState) => {
    // create new root node
    let appState = getState()
    let rootNodeId = firebaseDb.ref('nodes').push().key
    let firstNodeId = firebaseDb.ref('nodes').push().key
    let newUserPageId = firebaseDb.ref('userPages').push().key

    let newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', appState.auth.id)
    let newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], '', appState.auth.id)
    let newUserPage = userPageFactory(newUserPageId, rootNodeId, appState.auth.id)

    userPageFirebaseActions.createUserPage(newUserPage, newRootNode, newFirstNode)
      .then(snapshot => {
        dispatch(appActions.navigateToUserPage(newUserPageId))
      })
  }

export const initializeUserHomePage = () =>
  (dispatch, getState) => {
    let appState = getState()
    let rootNodeId = firebaseDb.ref('nodes').push().key
    let firstNodeId = firebaseDb.ref('nodes').push().key
    let homeUserPageId = firebaseDb.ref('userPages').push().key

    let newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', appState.auth.id)
    let newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], '', appState.auth.id)
    let newUserPage = userPageFactory(homeUserPageId, rootNodeId, appState.auth.id, 'Home', true)

    userPageFirebaseActions.createUserPage(newUserPage, newRootNode, newFirstNode)
            .then(snapshot => {
              dispatch(appActions.navigateToUserPage(homeUserPageId))
            })
  }

export const deleteUserPage = (userPageId) =>
  (dispatch, getState) => {
    if (confirm('Are you sure?')) {
      const appState = getState()
      let userPage = appState.userPages[userPageId]
      let rootNode = appState.nodes[userPage.rootNodeId]
      let auth = appState.auth

      userPageFirebaseActions.deleteUserPage(userPage, rootNode, auth)
      dispatch(appActions.navigateToUserPage(nodeSelectors.dictionaryToArray(appState.userPages).find(u => u.isHome).id))
      dispatch(userPageActions.userPageDeleted(userPageId))
    }
  }

export const updateUserPageName = (userPageId, newUserPageName) =>
  (dispatch, getState) => {
    const appState = getState()
    dispatch(userPageFirebaseActions.updateUserPageName(appState.userPages[userPageId], newUserPageName))
    dispatch(userPageActions.userPageNameUpdated(userPageId, newUserPageName))
  }

export const shareUserPage = (userPageId, emails) =>
  (dispatch, getState) => {
    if (!emails) {
      return
    }
    const appState = getState()
    let emailsArr = emails.split(',')
    let userPage = appState.userPages[userPageId]
    let allDescendantIds = nodeSelectors.getAllDescendantIds(nodeSelectors.getPresentNodes(appState), userPage.rootNodeId)
    dispatch(userPageFirebaseActions.shareUserPage(userPage, allDescendantIds, emailsArr, appState.auth))
  }
