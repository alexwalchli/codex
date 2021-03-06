import * as nodeActionTypes from './node-action-types'

export const initialTreeStateLoad = (rootNodeId, initialTreeState, userId) => ({
  type: nodeActionTypes.INITIAL_TREE_STATE_LOAD,
  payload: {
    rootNodeId,
    initialTreeState,
    userId
  }
})

export const nodeCreation = (nodeId, originNodeId, parentId, nodeIdsToDeselect, nodeIdToUnfocus, originOffset, content, userPageId, userId) => ({
  type: nodeActionTypes.NODE_CREATION,
  payload: {
    nodeId,
    originNodeId,
    parentId,
    nodeIdsToDeselect,
    nodeIdToUnfocus,
    originOffset,
    content,
    userPageId,
    userId
  }
})

export const nodeMove = (nodeId, newParentId, currentParentId, userId) => ({
  type: nodeActionTypes.NODE_MOVE,
  payload: {
    nodeId,
    newParentId,
    currentParentId,
    userId
  }
})

export const nodeDeletion = (nodeId, parentId, allDescendantIds, userId) => ({
  type: nodeActionTypes.NODE_DELETION,
  payload: {
    nodeId,
    parentId,
    allDescendantIds,
    userId
  }
})

export const nodeContentUpdate = (nodeId, content, userId, tags) => ({
  type: nodeActionTypes.NODE_CONTENT_UPDATE,
  payload: {
    nodeId,
    content,
    userId,
    tags
  }
})

export const nodeNotesUpdate = (nodeId, notes, tags, userId) => ({
  type: nodeActionTypes.NODE_NOTES_UPDATE,
  payload: {
    nodeId,
    notes,
    tags,
    userId
  }
})

export const nodeFocus = (nodeId, focusNotes, anchorPosition) => ({
  type: nodeActionTypes.NODE_FOCUS,
  undoable: false,
  payload: {
    nodeId,
    focusNotes,
    anchorPosition
  }
})

export const nodeUnfocus = (nodeId) => ({
  type: nodeActionTypes.NODE_UNFOCUS,
  undoable: false,
  payload: {
    nodeId
  }
})

export const nodeUnfocusAll = () => ({
  type: nodeActionTypes.NODE_UNFOCUS_ALL,
  undoable: false,
  payload: {}
})

export const nodeDemotion = (nodeId, currentParentId, newParentId, addNodeAfterNewSiblingId, visibleNodes, userId) => ({
  type: nodeActionTypes.NODE_DEMOTION,
  payload: {
    nodeId,
    currentParentId,
    newParentId,
    addNodeAfterNewSiblingId,
    visibleNodes,
    userId
  }
})

export const nodePromotion = (nodeId, siblingIds, currentParentId, newParentId, visibleNodes, userId) => ({
  type: nodeActionTypes.NODE_PROMOTION,
  payload: {
    nodeId,
    siblingIds,
    currentParentId,
    newParentId,
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

export const nodeExpansion = (nodeId, descendantIds, uncollapsedDescendantIds, userId) => ({
  type: nodeActionTypes.NODE_EXPANSION,
  payload: {
    nodeId,
    descendantIds,
    uncollapsedDescendantIds,
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
    nodeId,
    undoable: false
  }
})

export const nodeDeselection = (nodeId) => ({
  type: nodeActionTypes.NODE_DESELECTION,
  payload: {
    nodeId,
    undoable: false
  }
})

export const nodeCompletionToggle = (nodeId, userId) => ({
  type: nodeActionTypes.NODE_COMPLETION_TOGGLE,
  payload: {
    nodeId,
    userId
  }
})

export const nodeShiftUp = (nodeId, parentId) => ({
  type: nodeActionTypes.NODE_SHIFT_UP,
  payload: {
    nodeId,
    parentId
  }
})

export const nodeShiftDown = (nodeId, parentId) => ({
  type: nodeActionTypes.NODE_SHIFT_DOWN,
  payload: {
    nodeId,
    parentId
  }
})

export const nodeCopyUp = (nodeId, parentId) => ({
  type: nodeActionTypes.NODE_COPY_UP,
  payload: {
    nodeId, parentId
  }
})

export const nodeCopyDown = (nodeId, parentId) => ({
  type: nodeActionTypes.NODE_COPY_DOWN,
  payload: {
    nodeId, parentId
  }
})

export const nodeAdditionFromSubscription = (node) => ({
  type: nodeActionTypes.NODE_ADDITION_FROM_SUBSCRIPTION,
  payload: {
    node
  }
})

export const nodeUpdateFromSubscription = (node) => ({
  type: nodeActionTypes.NODE_ADDITION_FROM_SUBSCRIPTION,
  payload: {
    node
  }
})

export const nodeDeletionFromSubscription = (nodeId) => ({
  type: nodeActionTypes.NODE_DELETION_FROM_SUBSCRIPTION,
  payload: {
    nodeId
  }
})

export const nodeMenuToggle = (nodeId) => ({
  type: nodeActionTypes.NODE_MENU_TOGGLE,
  payload: { nodeId }
})

export const nodeAllMenusClose = (exceptNodeId) => ({
  type: nodeActionTypes.NODE_ALL_MENUS_CLOSE,
  payload: { exceptNodeId }
})
