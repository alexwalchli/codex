import * as searchActionTypes from './search-action-types'

export const searchResult = (phrase, nodeIdsResult, ancestorIdsOfSearchResult) => ({
  type: searchActionTypes.SEARCH_RESULT,
  payload: {
    phrase,
    nodeIdsResult,
    ancestorIdsOfSearchResult
  }
})

export const clearSearch = () => ({
  type: searchActionTypes.SEARCH_CLEAR,
  payload: {}
})
