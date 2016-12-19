import * as userPageActionTypes from './userpage-action-types'

export const userPageCreation = (userPage, rootNode, firstNode) => ({
  type: userPageActionTypes.USER_PAGE_CREATION,
  payload: {
    userPage,
    rootNode,
    firstNode
  }
})

export const userPageDeletion = (userPageId) => ({
  type: userPageActionTypes.USER_PAGE_DELETION,
  payload: {
    userPageId
  }
})

export const userPageNameUpdate = (userPageId, newUserPageName) => ({
  type: userPageActionTypes.USER_PAGE_NAME_UPDATE,
  payload: {
    userPageId,
    newUserPageName
  }
})
