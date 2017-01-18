import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  SEARCH_RESULT
} from './search-action-types'

const initialSearchState = I.Map({})
export const search = reducerFactory(initialSearchState, {
  [SEARCH_RESULT]: (state, action) => {
    return state.merge({
      currentlySearchingOn: action.payload.phrase
    })
  }
})
