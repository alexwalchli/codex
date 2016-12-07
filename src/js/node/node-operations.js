import * as nodeSelectors from './node-selectors'
import * as I from 'immutable'
import { NodeRecord } from './node-record'
import { setMany } from '../utilities/immutable-helpers'

export const makeNode = (id, parentId, childIds, content, createdById) => {
  return new NodeRecord({
    id,
    parentId,
    childIds,
    content,
    createdById
  })
}

export const addChild = (parentNode, childNodeId, originNodeId, originOffset, userId) => {
  const currentChildIds = I.List(parentNode.get('childIds'))

  if (currentChildIds.includes(childNodeId)) {
    return parentNode
  }

  if (originNodeId) {
    parentNode = parentNode.set('childIds', currentChildIds.splice(currentChildIds.indexOf(originNodeId) + originOffset, 0, childNodeId))
  } else {
    parentNode = parentNode.updateIn(['childIds'], (childIds) => [childNodeId, ...childIds])
  }

  return parentNode.merge({
    lastUpdatedById: userId
  })
}

export const removeChild = (parentNode, childNodeId, userId) => {
  return parentNode.updateIn(['childIds'], childIds => childIds.filter((childId) => childId !== childNodeId))
                   .merge({ lastUpdatedById: userId })
}

export const updateParent = (node, parentId, userId) => {
  return node.merge({
    parentId,
    lastUpdatedById: userId
  })
}

export const updateContent = (node, content, userId) => {
  return node.merge({
    content,
    lastUpdatedById: userId
  })
}

export const updateNotes = (node, notes, userId) => {
  return node.merge({
    notes,
    lastUpdatedById: userId
  })
}

export const deleteNode = (state, nodeId, parentId, userId) => {
  state = state.update(parentId, parent => removeChild(parent, nodeId, userId))
  return state.update(nodeId, node => node.merge({
    deleted: true,
    selected: false,
    lastUpdatedById: userId
  }))
}

export const select = (state, nodeIds) => {
  return setMany(state, nodeIds, { selected: true })
}

export const deselect = (state, nodeIds) => {
  return setMany(state, nodeIds, { selected: false })
}

export const unfocus = (node) => {
  return node.merge({
    focused: false,
    notesFocused: false
  })
}

export const focus = (state, nodeId, focusNotes = false) => {
  const currentlyFocusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(state)
  if (currentlyFocusedNodeId && currentlyFocusedNodeId !== nodeId) {
    state = state.set(currentlyFocusedNodeId, unfocus(state.get(currentlyFocusedNodeId)))
  }

  state = deselect(state, nodeSelectors.getCurrentlySelectedNodeIds(state))

  return state.updateIn([nodeId], (node) => node.merge({
    focused: !focusNotes,
    notesFocused: focusNotes
  }))
}

export const expand = (state, nodeIds, userId) => {
  return nodeIds.reduce((acc, id) => {
    return acc.setIn([id, 'collapsedBy', userId], false)
  }, state)
}

export const collapse = (state, nodeIds, userId) => {
  return nodeIds.reduce((acc, id) => {
    return acc.setIn([id, 'collapsedBy', userId], true)
  }, state)
}

export const reassignParent = (state, nodeId, currentParentId, newParentd, addAfterSiblingId, userId) => {
  state = state.updateIn([currentParentId], currentParentNode => removeChild(currentParentNode, nodeId, userId))
  state = state.updateIn([nodeId], node => updateParent(node, newParentd, userId))
  return state.updateIn([newParentd], newParentNode => addChild(newParentNode, nodeId, addAfterSiblingId, 1, userId))
}

export const complete = (node, userId) => {
  return node.merge({
    completed: !node.get('completed'),
    lastUpdatedById: userId
  })
}
