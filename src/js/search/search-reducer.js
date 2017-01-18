import * as I from 'immutable'
import reducerFactory from '../redux/reducer-factory'
import {
  SEARCH_RESULT,
  SEARCH_CLEAR
} from './search-action-types'

const initialSearchState = I.Map({
  currentlySearchingOn: '',
  nodeIdsInSearchResult: I.Map(),
  ancestorIdsOfSearchResult: I.Map()
})
export const search = reducerFactory(initialSearchState, {
  [SEARCH_RESULT]: (state, action) => {
    return state.merge({
      currentlySearchingOn: action.payload.phrase,
      nodeIdsInSearchResult: action.payload.nodeIdsResult,
      ancestorIdsOfSearchResult: action.payload.ancestorIdsOfSearchResult
    })
  },
  [SEARCH_CLEAR]: (state, action) => {
    return initialSearchState
  }
})
