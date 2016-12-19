import reducerFactory from '../redux/reducer-factory'
import * as I from 'immutable'
import {
  USER_PAGE_CREATION,
  USER_PAGE_NAME_UPDATE,
  USER_PAGE_DELETION
} from './userpage-action-types.js'
import {
  INITIAL_STATE_LOAD
} from '../app/app-action-types.js'

export const userPages = reducerFactory(I.Map({}), {

  [INITIAL_STATE_LOAD]: (state, action) => {
    return action.payload.userPages
  },

  [USER_PAGE_CREATION]: (state, action) => {
    return state.set(action.payload.userPage.get('id'), action.payload.userPage)
  },

  [USER_PAGE_NAME_UPDATE]: (state, action) => {
    const { userPageId, newUserPageName } = action.payload.newUserPageName
    return state.setIn([userPageId, 'title'], newUserPageName)
  },

  [USER_PAGE_DELETION]: (state, action) => {
    return state.delete(action.payload.userPageId)
  }

})
