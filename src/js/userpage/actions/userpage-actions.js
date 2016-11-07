import * as userPageActionTypes from './userpage-action-types'

export function userPageCreated (userPage) {
  return {
    type: userPageActionTypes.USER_PAGE_CREATED,
    payload: userPage
  }
}

export function userPageDeleted (userPageId) {
  return {
    type: userPageActionTypes.USER_PAGE_DELETED,
    payload: {
      userPageId
    }
  }
}

export function userPageNameUpdated (userPageId, newUserPageName) {
  return {
    type: userPageActionTypes.USER_PAGE_NAME_UPDATED,
    payload: {
      userPageId,
      newUserPageName
    }
  }
}
