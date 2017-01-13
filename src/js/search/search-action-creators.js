import searchActions from './search-actions'

export const search = (phrase, tags) => (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    let nodeIdsResult = treeState.reduce((results, node) => {
        const wordsInContent = node.content.split(' ')
        if(wordsInContent.find(word => word.startsWith(phrase))) {
            results.push(node.id)
        }
    }, [])

    dispatch(searchActions.searchResult(nodeIdsResult))
}