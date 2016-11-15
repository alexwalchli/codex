import * as nodeActionTypes from '../actions/node-action-types'
import { dictionaryToArray } from '../selectors/node-selectors'

function childIds (state, action) {
  switch (action.type) {
    case nodeActionTypes.CHILD_IDS_UPDATED:
      return Object.assign([], action.payload.newChildIds)
    case nodeActionTypes.REMOVE_CHILD_NODE:
      return Object.assign([], state.filter(id => id !== action.payload.childId))
  }
}

function taggedByIds (state, action) {
  switch (action.type) {
    case nodeActionTypes.TAG_ADDED:
      return [...state, action.payload.tagId]
    case nodeActionTypes.TAG_REMOVED:
      return Object.assign([], state.filter(tagId => tagId !== action.payload.tagId))
  }
}

function node (state, action) {
  switch (action.type) {
    case nodeActionTypes.NODE_CREATED:
      return newNode(action.payload)
    case nodeActionTypes.NODE_UPDATED:
      return Object.assign({}, action.payload)
    case nodeActionTypes.NODE_FOCUSED:
      return Object.assign({}, state, {
        focused: !action.payload.focusNotes,
        notesFocused: action.payload.focusNotes
      })
    case nodeActionTypes.NODE_UNFOCUSED:
      return Object.assign({}, state, {
        focused: false,
        notesFocused: false
      })
    case nodeActionTypes.NODE_SELECTED:
      return Object.assign({}, state, {
        selected: true
      })
    case nodeActionTypes.NODE_DESELECTED:
      return Object.assign({}, state, {
        selected: false
      })
    case nodeActionTypes.CONTENT_UPDATED:
      return Object.assign({}, state, {
        content: action.payload.content,
        lastUpdatedById: action.payload.updatedById
      })
    case nodeActionTypes.CHILD_IDS_UPDATED:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action),
        lastUpdatedById: action.payload.updatedById
      })
    case nodeActionTypes.REMOVE_CHILD_NODE:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action),
        lastUpdatedById: action.payload.updatedById
      })
    case nodeActionTypes.NODE_PARENT_UPDATED:
      return Object.assign({}, state, {
        parentId: action.payload.newParentId,
        lastUpdatedById: action.payload.updatedById
      })
    case nodeActionTypes.NODE_COLLAPSED:
      return Object.assign({}, state, {
        collapsedBy: Object.assign({}, state.collapsedBy, {
          [action.payload.userId]: true
        })
      })
    case nodeActionTypes.NODE_EXPANDED:
      return Object.assign({}, state, {
        collapsedBy: Object.assign({}, state.collapsedBy, {
          [action.payload.userId]: false
        })
      })
    case nodeActionTypes.NODE_MENU_TOGGLED:
      return Object.assign({}, state, {
        menuVisible: !state.menuVisible
      })
    case nodeActionTypes.NODE_COMPLETE_TOGGLED:
      return Object.assign({}, state, {
        completed: !state.completed
      })
    case nodeActionTypes.NODE_NOTES_UPDATED:
      return Object.assign({}, state, {
        notes: action.payload.notes
      })
    case nodeActionTypes.NODE_DISPLAY_MODE_UPDATED:
      return Object.assign({}, state, {
        displayMode: action.payload.mode
      })
    case nodeActionTypes.NODE_TAGS_UPDATED:
      return Object.assign({}, state, {
        taggedByIds: action.payload.updatedTagIds
      })
    case nodeActionTypes.TAG_ADDED:
      return Object.assign({}, state, {
        taggedByIds: taggedByIds(state.taggedByIds, action)
      })
    case nodeActionTypes.TAG_REMOVED:
      return Object.assign({}, state, {
        taggedByIds: taggedByIds(state.taggedByIds, action)
      })
    default:
      return state
  }
}

export function tree (state = {}, action) {
  var newState = Object.assign({}, state)

  if (action.type === nodeActionTypes.NODE_TRANSACTION) {
    action.payload.forEach(a => {
      newState = handleAction(newState, a)
    })
    return newState
  }

  return handleAction(newState, action)
}

function handleAction (newState, action) {
  const { nodeId } = action

  if (nodeId) {
    newState[nodeId] = node(newState[nodeId], action)
  }

  if (action.type === nodeActionTypes.INITIAL_NODE_STATE_LOADED) {
    const rootNode = action.payload.initialTreeState[action.payload.rootNodeId]
    const newState = Object.assign({}, action.payload.initialTreeState)
    newState[rootNode.childIds[0]] = node(newState[rootNode.childIds[0]], { type: nodeActionTypes.NODE_FOCUSED, payload: { focusNotes: false } })
    return newState
  }

  if (action.type === nodeActionTypes.NODES_DELETED) {
    action.payload.nodeIds.forEach(nodeId => {
      newState[nodeId].deleted = true
      newState[nodeId].visible = false
      newState[nodeId].selected = false
    })
  }

  if (action.type === nodeActionTypes.NODES_COMPLETED) {
    action.payload.nodeIds.forEach(nodeId => {
      newState[nodeId].completed = true
    })
  }

  if (action.type === nodeActionTypes.NODE_FOCUSED) {
    Object.keys(newState).forEach(nodeId => {
      if (action.nodeId !== nodeId) {
        newState[nodeId] = node(newState[nodeId], { type: nodeActionTypes.NODE_UNFOCUSED, nodeId })
      }
    })
  }

  if (action.type === nodeActionTypes.CLOSE_ALL_NODE_MENUS_AND_DESELECT_ALL_NODES) {
    dictionaryToArray(newState).forEach((n) => {
      newState[n.id] = node(n, { type: nodeActionTypes.NODE_DESELECTED })
      if (n.id !== action.payload.excludeNodeId && newState[n.id].menuVisible) {
        newState[n.id] = node(n, { type: nodeActionTypes.NODE_MENU_TOGGLED })
      }
    })
  }

  return newState
}

function newNode (node) {
  var newNode = Object.assign({}, node)
  newNode.childIds = node.childIds || []
  newNode.taggedByIds = node.taggedByIds || []

  return newNode
}
