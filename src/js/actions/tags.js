import * as nodeActions from './node'

export const TAG_CREATED = 'TAG_CREATED'

export const createTag = (type, id, label, nodeId) => {
  return (dispatch, getState) => {
    const appState = getState()
    if (!appState.tags.find(t => t.id === id)) {
      dispatch(tagCreated(type, id, label))
      dispatch(nodeActions.addTagToNode(type, nodeId, id))
      // TODO: dispatch(firebaseTagActions.createTag(id, label))
    }
  }
}

export const tagCreated = (type, id, label) => {
  return {
    type: TAG_CREATED,
    payload: {
      tag: { type, id, label }
    }
  }
}
