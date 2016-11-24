import * as nodeActionTypes from './node-action-types'

// new actions

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

export const nodeFocusAbove = (nodeId) => ({
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

// old types
export const nodeTransaction = (events) => {
  return {
    type: nodeActionTypes.NODE_TRANSACTION,
    payload: events
  }
}

// export const nodeCreated = (newNode) => ({
//   type: nodeActionTypes.NODE_CREATED,
//   nodeId: newNode.id,
//   payload: newNode
// })

export const nodeUpdated = (updatedNode) => ({
  type: nodeActionTypes.NODE_UPDATED,
  nodeId: updatedNode.id,
  payload: updatedNode
})

// export const contentUpdated = (nodeId, content, updatedById) => ({
//   type: nodeActionTypes.CONTENT_UPDATED,
//   nodeId,
//   payload: {
//     content,
//     updatedById
//   }
// })

export const childIdsUpdated = (nodeId, newChildIds, updatedById) => ({
  type: nodeActionTypes.CHILD_IDS_UPDATED,
  nodeId,
  payload: {
    newChildIds,
    updatedById
  }
})

export const nodesDeleted = (nodeIds) => ({
  type: nodeActionTypes.NODES_DELETED,
  payload: {
    nodeIds
  }
})

export const nodeExpanded = (nodeId, allDescendentIds, userId) => ({
  type: nodeActionTypes.NODE_EXPANDED,
  nodeId,
  payload: {
    allDescendentIds,
    userId
  }
})

export const nodeCollapsed = (nodeId, allDescendentIds, userId) => ({
  type: nodeActionTypes.NODE_COLLAPSED,
  nodeId,
  payload: {
    allDescendentIds,
    userId
  }
})

// export const nodeFocused = (nodeId, focusNotes) => ({
//   type: nodeActionTypes.NODE_FOCUSED,
//   undoable: false,
//   nodeId,
//   payload: {
//     focusNotes
//   }
// })

// export const nodeUnfocused = (nodeId) => ({
//   type: nodeActionTypes.NODE_UNFOCUSED,
//   undoable: false,
//   nodeId
// })

// export const nodeDeselected = (nodeId) => ({
//   type: nodeActionTypes.NODE_DESELECTED,
//   undoable: false,
//   nodeId
// })

// export const nodeSelected = (nodeId) => ({
//   type: nodeActionTypes.NODE_SELECTED,
//   undoable: false,
//   nodeId
// })

export const nodeParentUpdated = (nodeId, newParentId, updatedById) => ({
  type: nodeActionTypes.NODE_PARENT_UPDATED,
  nodeId,
  payload: {
    newParentId,
    updatedById
  }
})

export const nodesSearched = (nodeIds) => ({
  type: nodeActionTypes.NODES_SEARCHED,
  undoable: false,
  payload: {
    resultingNodeIds: nodeIds
  }
})

export const nodeWidgetsUpdated = (nodeId, widgets) => ({
  type: nodeActionTypes.NODE_WIDGETS_UPDATED,
  nodeId,
  widgets
})

export const nodeWidgetDataUpdating = (nodeId) => ({
  type: nodeActionTypes.NODE_WIDGETS_UPDATING,
  nodeId
})

export const closeAllMenusAndDeselectAllNodes = (excludeNodeId) => ({
  type: nodeActionTypes.CLOSE_ALL_NODE_MENUS_AND_DESELECT_ALL_NODES,
  undoable: false,
  payload: {
    excludeNodeId
  }
})

export const nodeCompleteToggled = (nodeId) => ({
  type: nodeActionTypes.NODE_COMPLETE_TOGGLED,
  nodeId
})

export const nodesCompleted = (nodeIds) => ({
  type: nodeActionTypes.NODES_COMPLETED,
  payload: {
    nodeIds
  }
})

export const nodeNotesUpdated = (nodeId, notes) => ({
  type: nodeActionTypes.NODE_NOTES_UPDATED,
  nodeId,
  payload: {
    notes
  }
})

export const nodeDisplayModeUpdated = (nodeId, mode) => ({
  type: nodeActionTypes.NODE_DISPLAY_MODE_UPDATED,
  nodeId,
  payload: {
    mode
  }
})

export const nodeMenuToggled = (nodeId) => ({
  type: nodeActionTypes.NODE_MENU_TOGGLED,
  nodeId,
  undoable: false
})

export const removeChildNode = (nodeId, childId) => ({
  type: nodeActionTypes.REMOVE_CHILD_NODE,
  nodeId,
  payload: {
    childId
  }
})

export const nodeTagsUpdated = (nodeId, updatedTagIds) => ({
  type: nodeActionTypes.NODE_TAGS_UPDATED,
  nodeId,
  payload: {
    updatedTagIds
  }
})

export const tagAdded = (nodeId, tagId) => ({
  type: nodeActionTypes.TAG_ADDED,
  nodeId,
  payload: {
    tagId
  }
})

export const tagRemoved = (nodeId, tagId) => ({
  type: nodeActionTypes.TAG_REMOVED,
  nodeId,
  payload: {
    tagId
  }
})
