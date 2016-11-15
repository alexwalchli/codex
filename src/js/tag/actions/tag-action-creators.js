import * as nodeActionCreators from '../../node/actions/node-action-creators'
import * as tagActions from '../../tag/actions/tag-actions'
import * as tagFirebaseActions from './tag-firebase-actions'

export const createTag = (type, label, nodeId) =>
  (dispatch, getState) => {
    const appState = getState()
    const tagId = type + label.toLowerCase()
    if (!appState.tags.find(t => t.id === tagId)) {
      dispatch(tagActions.tagCreated(type, tagId, label))
      dispatch(nodeActionCreators.addTagToNode(nodeId, tagId))
      dispatch(tagFirebaseActions.createTag(tagId, appState.app.currentUserPageId))
    }
  }
