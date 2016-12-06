import * as userPageActionTypes from './userpage-action-types'

export const userPageCreation = (userPage) => ({
  type: userPageActionTypes.USER_PAGE_CREATION,
  payload: userPage
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
