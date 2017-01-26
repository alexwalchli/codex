import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  TYPE_SCALE_UPDATE,
  USER_PREFERENCES_INITIAL_LOAD
} from './user-preferences-action-types'

const initialAppState = I.Map({})
export const userPreferences = reducerFactory(initialAppState, {
  [TYPE_SCALE_UPDATE]: (state, action) => {
    return state.merge({
      typeScale: action.payload.typeScale
    })
  },
  [USER_PREFERENCES_INITIAL_LOAD]: (state, action) => {
    return I.Map(action.payload.userPreferences)
  }
})
