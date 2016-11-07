import * as nodeActionCreators from '../../node/actions/node-action-creators'
import * as tagActions from '../../tag/actions/tag-actions'

export const createTag = (type, id, label, nodeId) =>
  (dispatch, getState) => {
    const appState = getState()
    if (!appState.tags.find(t => t.id === id)) {
      dispatch(tagActions.tagCreated(type, id, label))
      dispatch(nodeActionCreators.addTagToNode(nodeId, id))
      // TODO: dispatch(firebaseTagActions.createTag(id, label))
    }
  }
