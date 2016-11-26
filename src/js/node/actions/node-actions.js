import * as nodeActionTypes from './node-action-types'

export const initialTreeStateLoad = (rootNodeId, initialTreeState, userId) => ({
  type: nodeActionTypes.INITIAL_TREE_STATE_LOAD,
  payload: {
    rootNodeId,
    initialTreeState,
    userId
  }
})

export const nodeCreation = (nodeId, originNodeId, originOffset, content, userPageId, userId) => ({
  type: nodeActionTypes.NODE_CREATION,
  payload: {
    nodeId,
    originNodeId,
    originOffset,
    content,
    userPageId,
    userId
  }
})

export const nodeContentUpdate = (nodeId, content, userId) => ({
  type: nodeActionTypes.NODE_CONTENT_UPDATE,
  payload: {
    nodeId,
    content,
    userId
  }
})

export const nodeNotesUpdate = (nodeId, notes, userId) => ({
  type: nodeActionTypes.NODE_NOTES_UPDATE,
  payload: {
    nodeId,
    notes,
    userId
  }
})

export const nodeFocus = (nodeId, focusNotes) => ({
  type: nodeActionTypes.NODE_FOCUS,
  undoable: false,
  payload: {
    nodeId,
    focusNotes
  }
})

export const nodeUnfocus = (nodeId) => ({
  type: nodeActionTypes.NODE_UNFOCUS,
  undoable: false,
  payload: {
    nodeId
  }
})

export const nodeDemotion = (nodeId, rootNodeId, visibleNodes, userId) => ({
  type: nodeActionTypes.NODE_DEMOTION,
  payload: {
    nodeId,
    rootNodeId,
    visibleNodes,
    userId
  }
})

export const nodePromotion = (nodeId, rootNodeId, visibleNodes, userId) => ({
  type: nodeActionTypes.NODE_PROMOTION,
  payload: {
    nodeId,
    rootNodeId,
    visibleNodes,
    userId
  }
})

export const nodeExpansionToggle = (nodeId, forceToggleChildrenExpansion, userId) => ({
  type: nodeActionTypes.NODE_EXPANSION_TOGGLE,
  payload: {
    nodeId,
    forceToggleChildrenExpansion,
    userId
  }
})

export const nodeExpansion = (nodeId, descendantIds, uncollapsedChildren, userId) => ({
  type: nodeActionTypes.NODE_EXPANSION,
  payload: {
    nodeId,
    descendantIds,
    userId
  }
})

export const nodeCollapse = (nodeId, descendantIds, userId) => ({
  type: nodeActionTypes.NODE_COLLAPSE,
  payload: {
    nodeId,
    descendantIds,
    userId
  }
})

export const nodeSelection = (nodeId) => ({
  type: nodeActionTypes.NODE_SELECTION,
  payload: {
    nodeId
  }
})

export const nodeDeselection = (nodeId) => ({
  type: nodeActionTypes.NODE_DESELECTION,
  payload: {
    nodeId
  }
})

export const nodeCompletionToggle = (nodeId, userId) => ({
  type: nodeActionTypes.NODE_COMPLETION_TOGGLE,
  payload: {
    nodeId,
    userId
  }
})

export const nodeUpdateFromSubscription = (node) => ({
  type: nodeActionTypes.NODE_UPDATE_FROM_SUBSCRIPTION,
  payload: { ...node }
})

export const nodeDeletionFromSubscription = (nodeId) => ({
  type: nodeActionTypes.NODE_DELETION_FROM_SUBSCRIPTION,
  payload: {
    nodeId
  }
})
