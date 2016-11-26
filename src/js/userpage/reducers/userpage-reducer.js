import reducerFactory from '../../redux/reducer-factory'
import {
  USER_PAGE_CREATION,
  USER_PAGE_NAME_UPDATE,
  USER_PAGE_DELETION
} from '../actions/userpage-action-types.js'

export const userPage = reducerFactory({

  [USER_PAGE_CREATION]: (state, action) => {
    return Object.assign({}, state, {
      [action.payload.id]: action.payload
    })
  },

  [USER_PAGE_NAME_UPDATE]: (state, action) => {
    let newState = Object.assign({}, state)
    newState[action.payload.userPageId].title = action.payload.newUserPageName
    return newState
  },

  [USER_PAGE_DELETION]: (state, action) => {
    let newState = Object.assign({}, state)
    delete newState[action.payload.userPageId]
    return newState
  }

})
