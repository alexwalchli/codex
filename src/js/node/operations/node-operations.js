import * as nodeSelectors from '../selectors/node-selectors'

export const create = (id, parentId, childIds, content, createdById) => {
  return {
    id,
    parentId,
    childIds: childIds || [],
    content: content || '',
    createdById,
    visible: true,
    collapsedBy: {},
    taggedByIds: []
  }
}

export const addChild = (parentNode, childNodeId, originNodeId, originOffset, userId) => {
  let updatedChildIds

  if (parentNode.childIds.includes(childNodeId)) {
    // don't add the child ID if it's already been added
    return Object.assign({}, parentNode)
  }

  if (originNodeId) {
    // if the child was created from a specific node, add it in front or behind the node it was created from based on the offset
    updatedChildIds = [...parentNode.childIds]
    updatedChildIds.splice(parentNode.childIds.indexOf(originNodeId) + originOffset, 0, childNodeId)
  } else {
    // prepend the childId by default
    updatedChildIds = [childNodeId, ...parentNode.childIds]
  }

  return Object.assign({}, parentNode, {
    childIds: updatedChildIds,
    updatedById: userId
  })
}

export const removeChild = (parentNode, childNodeId, userId) => {
  return Object.assign({}, parentNode, {
    childIds: parentNode.childIds.filter(id => id !== childNodeId),
    updatedById: userId
  })
}

export const updateParent = (node, parentId, userId) => {
  return Object.assign({}, node, {
    parentId,
    updatedById: userId
  })
}

export const updateContent = (node, content, userId) => {
  return Object.assign({}, node, {
    content,
    updatedById: userId
  })
}

export const updateNotes = (node, notes, userId) => {
  return Object.assign({}, node, {
    notes,
    updatedById: userId
  })
}

export const select = (state, nodeIds) => {
  let newState = Object.assign({}, state)
  nodeIds.forEach(nodeId => {
    newState[nodeId] = Object.assign({}, newState[nodeId], {
      selected: true
    })
  })

  return newState
}

export const deselect = (state, nodeIds) => {
  let newState = Object.assign({}, state)
  nodeIds.forEach(nodeId => {
    newState[nodeId] = Object.assign({}, newState[nodeId], {
      selected: false
    })
  })

  return newState
}

export const unfocus = (node) => {
  return Object.assign({}, node, {
    focused: false,
    notesFocused: false
  })
}

export const focus = (state, nodeId, focusNotes) => {
  let newState = Object.assign(state)
  const currentlyFocusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(state)

  if (currentlyFocusedNodeId) {
    newState[currentlyFocusedNodeId] = unfocus(newState[currentlyFocusedNodeId])
  }

  nodeSelectors.getCurrentlySelectedNodeIds(state).forEach(id => {
    newState = deselect(state, [ id ])
  })

  newState[nodeId] = Object.assign({}, newState[nodeId], {
    focused: !focusNotes,
    notesFocused: focusNotes
  })

  return newState
}

export const expand = (state, nodeIds, userId) => {
  nodeIds.forEach(nodeId => {
    state[nodeId] = Object.assign({}, state[nodeId], {
      collapsedBy: Object.assign({}, state[nodeId].collapsedBy, {
        [userId]: false
      })
    })
  })

  return state
}

export const collapse = (state, nodeIds, userId) => {
  nodeIds.forEach(nodeId => {
    state[nodeId] = Object.assign({}, state[nodeId], {
      collapsedBy: Object.assign({}, state[nodeId].collapsedBy, {
        [userId]: true
      })
    })
  })

  return state
}

export const reassignParent = (state, nodeId, currentParentId, newParentd, addAfterSiblingId, userId) => {
  let newState = Object.assign(state)

  newState[currentParentId] = removeChild(newState[currentParentId], nodeId, userId)
  newState[nodeId] = updateParent(newState[nodeId], newParentd, userId)
  newState[newParentd] = addChild(newState[newParentd], nodeId, addAfterSiblingId, 1, userId)

  return newState
}

export const complete = (node, userId) => {
  return Object.assign({}, node, {
    completed: !node.completed,
    updatedById: userId
  })
}
