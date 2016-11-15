import * as nodeActionCreators from '../../node/actions/node-action-creators'
import * as tagActions from '../../tag/actions/tag-actions'

export const createTag = (type, label, nodeId) =>
  (dispatch, getState) => {
    const appState = getState()
    const tagId = type + label.toLowerCase()
    if (!appState.tags.find(t => t.id === tagId)) {
      dispatch(tagActions.tagCreated(type, tagId, label))
      dispatch(nodeActionCreators.addTagToNode(nodeId, tagId))
      // TODO: dispatch(firebaseTagActions.createTag(id, label))
    }
  }
