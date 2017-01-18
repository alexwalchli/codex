import * as searchActionTypes from './search-action-types'

export const searchResult = (phrase, nodeIdsResult) => ({
  type: searchActionTypes.SEARCH_RESULT,
  payload: {
    phrase,
    nodeIdsResult
  }
})
