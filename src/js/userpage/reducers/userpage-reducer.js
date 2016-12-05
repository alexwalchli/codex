import reducerFactory from '../../redux/reducer-factory'
import * as I from 'immutable'
import {
  USER_PAGE_CREATION,
  USER_PAGE_NAME_UPDATE,
  USER_PAGE_DELETION
} from '../actions/userpage-action-types.js'

export const userPages = reducerFactory(I.Map({}), {

  [USER_PAGE_CREATION]: (state, action) => {
    const { id } = action.payload
    return state.setIn([id], action.payload)
  },

  [USER_PAGE_NAME_UPDATE]: (state, action) => {
    const { userPageId, newUserPageName } = action.payload.newUserPageName
    return state.setIn([userPageId, 'title'], newUserPageName)
  },

  [USER_PAGE_DELETION]: (state, action) => {
    return state.delete(action.payload.userPageId)
  }

})
