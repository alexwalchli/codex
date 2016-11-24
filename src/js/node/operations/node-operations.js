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

export const updateContent = (node, content) => {
  return Object.assign({}, node, {
    content
  })
}

export const select = (node) => {
  return Object.assign({}, node, {
    selected: true
  })
}

export const deselect = (node) => {
  return Object.assign({}, node, {
    selected: false
  })
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
    newState[id] = deselect(newState[id])
  })

  newState[nodeId] = Object.assign({}, newState[nodeId], {
    focused: !focusNotes,
    notesFocused: focusNotes
  })

  return newState
}

export const reassignParent = (state, nodeId, currentParentId, newParentd, addAfterSiblingId, userId) => {
  let newState = Object.assign(state)

  newState[currentParentId] = removeChild(newState[currentParentId], nodeId, userId)
  newState[nodeId] = updateParent(newState[nodeId], newParentd, userId)
  newState[newParentd] = addChild(newState[newParentd], nodeId, addAfterSiblingId, 1, userId)

  return newState
}
