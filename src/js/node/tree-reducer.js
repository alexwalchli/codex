import { reducerFactory } from '../redux/reducer-factory'
import * as nodeOperations from './node-operations'
import * as nodeSelectors from './node-selectors'
import * as I from 'immutable'
import {
  INITIAL_TREE_STATE_LOAD,
  NODE_CREATION,
  NODE_MOVE,
  NODES_DELETION,
  NODE_DELETION,
  NODE_CONTENT_UPDATE,
  NODE_FOCUS,
  NODE_UNFOCUS,
  NODE_UNFOCUS_ALL,
  NODE_DEMOTION,
  NODE_PROMOTION,
  NODE_EXPANSION_TOGGLE,
  NODE_EXPANSION,
  NODE_COLLAPSE,
  NODE_SELECTION,
  NODE_DESELECTION,
  NODE_COMPLETION_TOGGLE,
  NODES_COMPLETION,
  NODE_NOTES_UPDATE,
  NODE_DISPLAY_MODE_UPDATE,
  NODE_TAG_ADDITION,
  NODE_TAG_REMOVAL,
  NODE_ADDITION_FROM_SUBSCRIPTION,
  NODE_UPDATE_FROM_SUBSCRIPTION,
  NODE_DELETION_FROM_SUBSCRIPTION,
  NODE_SHIFT_UP,
  NODE_SHIFT_DOWN,
  NODE_COPY_UP,
  NODE_COPY_DOWN,
  NODE_MENU_TOGGLE,
  NODE_ALL_MENUS_CLOSE
} from './node-action-types'

const initialTreeState = I.Map({})
export const tree = reducerFactory(initialTreeState, {

  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    const { initialTreeState, rootNodeId } = action.payload
    const rootNode = initialTreeState.get(rootNodeId)
    return nodeOperations.focus(action.payload.initialTreeState, rootNode.get('childIds').get(0), false)
  },

  [NODE_CREATION]: (state, action) => {
    const { nodeId, originNodeId, originOffset, content, parentId, userPageId, nodeIdsToDeselect, nodeIdToUnfocus, userId } = action.payload
    const parentNode = state.get(parentId)

    state = state.setIn([nodeId], nodeOperations.makeNode(nodeId, parentId, I.List([]), userPageId, content, userId))
    state = state.updateIn([parentId], node => nodeOperations.addChild(parentNode, nodeId, originNodeId, originOffset, userId))

    if (originOffset > 0) {
      state = state.updateIn([nodeIdToUnfocus], node => nodeOperations.unfocus(node))
      state = nodeOperations.deselect(state, nodeIdsToDeselect)
      state = nodeOperations.focus(state, nodeId, false)
    }

    return state
  },

  [NODE_MOVE]: (state, action) => {
    const { nodeId, newParentId, currentParentId, userId } = action.payload

    return nodeOperations.reassignParent(state, nodeId, currentParentId, newParentId, null, userId)
  },

  [NODE_ADDITION_FROM_SUBSCRIPTION]: (state, action) => {
    const { node } = action.payload

    if (state.get(node.id)) {
      return state
    }
    return state.set(node.id, node)
  },

  [NODE_UPDATE_FROM_SUBSCRIPTION]: (state, action) => {
    // TODO: potentially do a diff here to avoid collisions?
    const { node } = action.payload
    return state.set(node.id, node)
  },

  [NODE_DELETION_FROM_SUBSCRIPTION]: (state, action) => {
    // TODO:
  },

  [NODES_DELETION]: (state, action) => {
    // TODO:
  },

  [NODE_DELETION]: (state, action) => {
    const { nodeId, parentId, allDescendantIds, userId } = action.payload
    return [nodeId, ...allDescendantIds].reduce((acc, nid) => {
      return nodeOperations.deleteNode(acc, nodeId, parentId, userId)
    }, state)
  },

  [NODE_CONTENT_UPDATE]: (state, action) => {
    const { nodeId, content, userId } = action.payload
    return state.updateIn([nodeId], node => nodeOperations.updateContent(node, content, userId))
  },

  [NODE_FOCUS]: (state, action) => {
    return nodeOperations.focus(state, action.payload.nodeId, action.payload.focusNotes)
  },

  [NODE_UNFOCUS]: (state, action) => {
    const { nodeId } = action.payload
    return state.updateIn([nodeId], node => nodeOperations.unfocus(state.get(nodeId)))
  },

  [NODE_UNFOCUS_ALL]: (state, action) => {
    return nodeOperations.unfocusAll(state)
  },

  [NODE_DEMOTION]: (state, action) => {
    const { nodeId, currentParentId, newParentId,
            addNodeAfterNewSiblingId, userId } = action.payload

    state = nodeOperations.reassignParent(state, nodeId, currentParentId, newParentId, addNodeAfterNewSiblingId, userId)

    return nodeOperations.focus(state, nodeId, false)
  },

  [NODE_PROMOTION]: (state, action) => {
    const { nodeId, userId, currentParentId, newParentId, siblingIds } = action.payload

    // reassign all siblings below to the promoted node
    for (let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++) {
      let sibling = state.get(siblingIds[i])
      state = nodeOperations.reassignParent(state, sibling.get('id'), sibling.get('parentId'), nodeId, userId)
    }

    // reassign the node to its parent's parent
    state = nodeOperations.reassignParent(state, nodeId, currentParentId, newParentId, currentParentId, userId)

    return nodeOperations.focus(state, nodeId, false)
  },

  [NODE_EXPANSION_TOGGLE]: (state, action) => {
    const { nodeId, userId } = action.payload
    if (state.getIn([nodeId, 'collapsedBy', userId])) {
      state = nodeOperations.expand(state, [ nodeId ], userId)
    } else {
      state = nodeOperations.collapse(state, [ nodeId ], userId)
    }

    return state
  },

  [NODE_COLLAPSE]: (state, action) => {
    const { nodeId, userId } = action.payload
    return nodeOperations.collapse(state, [ nodeId ], userId)
  },

  [NODE_EXPANSION]: (state, action) => {
    const { nodeId, userId } = action.payload
    return nodeOperations.expand(state, [ nodeId ], userId)
  },

  [NODE_SELECTION]: (state, action) => {
    const { nodeId } = action.payload
    const allDescendentIds = nodeSelectors.getAllDescendantIds(state, nodeId)

    return nodeOperations.select(state, [ nodeId, ...allDescendentIds ])
  },

  [NODE_DESELECTION]: (state, action) => {
    const { nodeId } = action.payload
    const allDescendentIds = nodeSelectors.getAllDescendantIds(state, nodeId)

    return nodeOperations.deselect(state, [ nodeId, ...allDescendentIds ])
  },

  [NODE_COMPLETION_TOGGLE]: (state, action) => {
    const { nodeId, userId } = action.payload
    return state.updateIn([nodeId], node => nodeOperations.complete(node, userId))
  },

  [NODES_COMPLETION]: (state, action) => {

  },

  [NODE_NOTES_UPDATE]: (state, action) => {
    const { nodeId, notes, userId } = action.payload
    return state.updateIn([nodeId], node => nodeOperations.updateNotes(node, notes, userId))
  },

  [NODE_SHIFT_UP]: (state, action) => {
    const { nodeId, parentId } = action.payload
    return state.updateIn([parentId], parentNode => nodeOperations.repositionChild(parentNode, nodeId, -1))
  },

  [NODE_SHIFT_DOWN]: (state, action) => {
    const { nodeId, parentId } = action.payload
    return state.updateIn([parentId], parentNode => nodeOperations.repositionChild(parentNode, nodeId, 1))
  },

  [NODE_COPY_UP]: (state, action) => {
    const { nodeId, parentId } = action.payload
    return state.update(state => nodeOperations.copyAndShiftNode(state, parentId, nodeId, -1))
  },

  [NODE_COPY_DOWN]: (state, action) => {
    const { nodeId, parentId } = action.payload
    return state.update(state => nodeOperations.copyAndShiftNode(state, parentId, nodeId, 1))
  },

  [NODE_DISPLAY_MODE_UPDATE]: (state, action) => {

  },

  [NODE_TAG_ADDITION]: (state, action) => {

  },

  [NODE_TAG_REMOVAL]: (state, action) => {

  },

  [NODE_MENU_TOGGLE]: (state, action) => {
    const { nodeId } = action.payload
    return state.updateIn([nodeId], node => nodeOperations.toggleMenu(node))
  },

  [NODE_ALL_MENUS_CLOSE]: (state, action) => {
    const { exceptNodeId } = action.payload
    return state.update(state => nodeOperations.closeAllMenus(state, exceptNodeId))
  }
})
