import * as searchActions from './search-actions'
import * as nodeActions from '../node/node-actions'
import * as nodeSelectors from '../node/node-selectors'

export const searchNodes = (phrase, tags) => (dispatch, getState) => {
  const loweredPhrase = phrase.toLowerCase()
  const state = getState()
  const treeState = nodeSelectors.currentTreeState(state)
  const rootNodeId = nodeSelectors.getRootNodeId(state)
  const ancestorIdsOfSearchResult = {}

  let nodeIdsResult = treeState.reduce((results, node) => {
    const wordsInContent = node.content.split(' ')
    if (node.id === rootNodeId ||
        phrase.trim() === '' ||
        wordsInContent.find(word => word.toLowerCase().startsWith(loweredPhrase))) {
      results[node.id] = true
      const ancestors = nodeSelectors.getAncestorIds(treeState, rootNodeId, node.id)
      ancestors.forEach((ancestorId) => {
        ancestorIdsOfSearchResult[ancestorId] = true
      })
    }

    return results
  }, {})

  dispatch(searchActions.searchResult(phrase, nodeIdsResult, ancestorIdsOfSearchResult))
}

export const clearSearch = () => (dispatch, getState) => {
  dispatch(searchActions.clearSearch())
}

export const searchFocus = () => (dispatch) => {
  dispatch(nodeActions.nodeUnfocusAll())
}
