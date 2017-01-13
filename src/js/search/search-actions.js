import * as searchActionTypes from './search-action-types'

export const searchResult = (nodeIdsResult) => {(
    type: searchActionTypes.SEARCH_RESULT,
    payload: {
        nodeIdsResult
    }
)}