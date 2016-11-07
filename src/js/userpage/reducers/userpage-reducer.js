import * as userpageActionTypes from '../actions/userpage-action-types'

export function userPages (state = {}, action) {
  var newState = Object.assign({}, state)

  switch (action.type) {
    case userpageActionTypes.USER_PAGE_CREATED:
      newState[action.payload.id] = Object.assign({}, action.payload)
      return newState
    case userpageActionTypes.USER_PAGE_NAME_UPDATED:
      newState[action.payload.userPageId] = Object.assign({}, newState[action.payload.userPageId], {
        title: action.payload.newUserPageName
      })
      return newState
    case userpageActionTypes.USER_PAGE_DELETED:
      delete newState[action.payload.userPageId]
      return newState
    default:
      return newState
  }
}
