import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  TYPE_SCALE_UPDATE
} from './user-preferences-action-types'

const initialAppState = I.Map({})
export const app = reducerFactory(initialAppState, {
  [TYPE_SCALE_UPDATE]: (state, action) => {
    return state.merge({
      typeScale: action.typeScale
    })
  }
})
