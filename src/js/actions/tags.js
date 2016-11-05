import * as nodeActions from './node'

export const TAG_CREATED = 'TAG_CREATED'

export const createTag = (id, label, nodeId) => {
  return (dispatch, getState) => {
    const appState = getState()
    if (!appState.tags.find(t => t.id === id)) {
      dispatch(tagCreated(id, label))
      dispatch(nodeActions.addTagToNode(nodeId, id))
      // TODO: dispatch(firebaseTagActions.createTag(id, label))
    }
  }
}

export const tagCreated = (id, label) => {
  return {
    type: TAG_CREATED,
    payload: {
      tag: { id, label }
    }
  }
}
