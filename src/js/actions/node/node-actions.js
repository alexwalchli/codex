export const NODE_CREATED = 'NODE_CREATED'
export const NODE_UPDATED = 'NODE_UPDATED'
export const CONTENT_UPDATED = 'CONTENT_UPDATED'
export const CHILD_IDS_UPDATED = 'CHILD_IDS_UPDATED' // fired when a node's child ID has been added/deleted/moved
export const NODE_PARENT_UPDATED = 'NODE_PARENT_UPDATED' // a node's parent ID is updated
export const NODES_DELETED = 'NODES_DELETED'
export const NODE_EXPANSION_TOGGLED = 'NODE_EXPANSION_TOGGLED'
export const NODE_COLLAPSED = 'NODE_COLLAPSED'
export const NODE_EXPANDED = 'NODE_EXPANDED'
export const NODE_FOCUSED = 'NODE_FOCUSED'
export const NODE_UNFOCUSED = 'NODE_UNFOCUSED'
export const NODE_SELECTED = 'NODE_SELECTED'
export const NODE_DESELECTED = 'NODE_DESELECTED'
export const NODES_SEARCHED = 'NODES_SEARCHED'
export const NODE_WIDGETS_UPDATED = `NODE_WIDGETS_UPDATED` // signifies a node that has had its widget data updated
export const NODE_WIDGETS_UPDATING = `NODE_WIDGETS_UPDATING` // signifies a node that is having its widget data updated
export const TOGGLE_NODE_MENU = `TOGGLE_NODE_MENU`
export const CLOSE_ALL_NODE_MENUS_AND_DESELECT_ALL_NODES = `CLOSE_ALL_NODE_MENUS_AND_DESELECT_ALL_NODES`
export const NODE_COMPLETE_TOGGLED = `NODE_COMPLETE_TOGGLED`
export const NODES_COMPLETED = `NODES_COMPLETED`
export const NODE_NOTES_UPDATED = `NODE_NOTES_UPDATED`
export const NODE_DISPLAY_MODE_UPDATED = `NODE_DISPLAY_MODE_UPDATED`
export const NODE_MENU_TOGGLED = `TOGGLE_NODE_MENU`
export const REMOVE_CHILD_NODE = `REMOVE_CHILD_NODE`
export const NODE_TAGS_UPDATED = `NODE_TAGS_UPDATED`

export const nodeCreated = (newNode) => {
  return {
    type: NODE_CREATED,
    nodeId: newNode.id,
    payload: newNode
  }
}

export const nodeUpdated = (updatedNode) => {
  return {
    type: NODE_UPDATED,
    nodeId: updatedNode.id,
    payload: updatedNode
  }
}

export const contentUpdated = (nodeId, content, updatedById) => {
  return {
    type: CONTENT_UPDATED,
    nodeId,
    payload: {
      content,
      updatedById
    }
  }
}

export const childIdsUpdated = (nodeId, newChildIds, updatedById) => {
  return {
    type: CHILD_IDS_UPDATED,
    nodeId,
    payload: {
      newChildIds,
      updatedById
    }
  }
}

export const nodesDeleted = (nodeIds) => {
  return {
    type: NODES_DELETED,
    payload: {
      nodeIds
    }
  }
}

export const nodeExpanded = (nodeId, allDescendentIds, userId) => {
  return {
    type: NODE_EXPANDED,
    nodeId,
    payload: {
      allDescendentIds,
      userId
    }
  }
}

export const nodeCollapsed = (nodeId, allDescendentIds, userId) => {
  return {
    type: NODE_COLLAPSED,
    nodeId,
    payload: {
      allDescendentIds,
      userId
    }
  }
}

export const nodeFocused = (nodeId, focusNotes) => {
  return {
    type: NODE_FOCUSED,
    undoable: false,
    nodeId,
    payload: {
      focusNotes
    }
  }
}

export const nodeUnfocused = (nodeId) => {
  return {
    type: NODE_UNFOCUSED,
    undoable: false,
    nodeId
  }
}

export const nodeDeselected = (nodeId) => {
  return {
    type: NODE_DESELECTED,
    undoable: false,
    nodeId
  }
}

export const nodeSelected = (nodeId) => {
  return {
    type: NODE_SELECTED,
    undoable: false,
    nodeId
  }
}

export const nodeParentUpdated = (nodeId, newParentId, updatedById) => {
  return {
    type: NODE_PARENT_UPDATED,
    nodeId,
    payload: {
      newParentId,
      updatedById
    }
  }
}

export const nodesSearched = (nodeIds) => {
  return {
    type: NODES_SEARCHED,
    undoable: false,
    payload: {
      resultingNodeIds: nodeIds
    }
  }
}

export const nodeWidgetsUpdated = (nodeId, widgets) => {
  return {
    type: NODE_WIDGETS_UPDATED,
    nodeId,
    widgets
  }
}

export const nodeWidgetDataUpdating = (nodeId) => {
  return {
    type: NODE_WIDGETS_UPDATING,
    nodeId
  }
}

export const closeAllMenusAndDeselectAllNodes = (excludeNodeId) => {
  return {
    type: CLOSE_ALL_NODE_MENUS_AND_DESELECT_ALL_NODES,
    undoable: false,
    payload: {
      excludeNodeId
    }
  }
}

export const nodeCompleteToggled = (nodeId) => {
  return {
    type: NODE_COMPLETE_TOGGLED,
    nodeId
  }
}

export const nodesCompleted = (nodeIds) => {
  return {
    type: NODES_COMPLETED,
    payload: {
      nodeIds
    }
  }
}

export const nodeNotesUpdated = (nodeId, notes) => {
  return {
    type: NODE_NOTES_UPDATED,
    nodeId,
    payload: {
      notes
    }
  }
}

export const nodeDisplayModeUpdated = (nodeId, mode) => {
  return {
    type: NODE_DISPLAY_MODE_UPDATED,
    nodeId,
    payload: {
      mode
    }
  }
}

export const nodeMenuToggled = (nodeId) => {
  return {
    type: NODE_MENU_TOGGLED,
    nodeId,
    undoable: false
  }
}

export const removeChildNode = (nodeId, childId) => {
  return {
    type: REMOVE_CHILD_NODE,
    nodeId,
    payload: {
      childId
    }
  }
}

export const nodeTagsUpdated = (nodeId, updatedTagIds) => {
  return {
    type: NODE_TAGS_UPDATED,
    nodeId,
    payload: {
      updatedTagIds
    }
  }
}
