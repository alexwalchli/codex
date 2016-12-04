import { reducerFactory } from '../../redux/reducer-factory'
import * as nodeOperations from '../operations/node-operations'
import * as nodeSelectors from '../selectors/node-selectors'
import * as I from 'immutable'
import {
  INITIAL_TREE_STATE_LOAD,
  NODE_CREATION,
  NODES_DELETION,
  NODE_DELETION,
  NODE_CONTENT_UPDATE,
  NODE_FOCUS,
  NODE_UNFOCUS,
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
  NODE_UPSERT_FROM_SUBSCRIPTION,
  NODE_DELETION_FROM_SUBSCRIPTION
} from '../actions/node-action-types'

export const tree = reducerFactory(I.Map(), {

  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    const { initialTreeState, rootNodeId } = action.payload
    const rootNode = initialTreeState.get(rootNodeId)
    return nodeOperations.focus(action.payload.initialTreeState, rootNode.get('childIds').get(0), false)
  },

  [NODE_CREATION]: (state, action) => {
    const { nodeId, originNodeId, originOffset, content, parentId, nodeIdsToDeselect, nodeIdToUnfocus, userId } = action.payload
    const parentNode = state.get(parentId)

    // TODO: left off here...

    newState[nodeId] = nodeOperations.create(nodeId, parentNode.id, [], content, userId)
    newState[parentNode.id] = nodeOperations.addChild(parentNode, nodeId, originNodeId, originOffset, userId)

    if (originOffset > 0) {
      newState[nodeIdToUnfocus] = nodeOperations.unfocus(newState[nodeIdToUnfocus])
      newState = nodeOperations.deselect(newState, nodeIdsToDeselect)
      newState = nodeOperations.focus(newState, nodeId, false)
    }

    return newState
  },

  [NODE_DELETION_FROM_SUBSCRIPTION]: (state, action) => {
    // TODO:
  },

  [NODE_UPSERT_FROM_SUBSCRIPTION]: (state, action) => {
    // TODO:
  },

  [NODES_DELETION]: (state, action) => {
    // TODO:
  },

  [NODE_DELETION]: (state, action) => {
    const { nodeId, parentId, allDescendantIds, userId } = action.payload
    return [nodeId, ...allDescendantIds].reduce((acc, nid) => {
      return nodeOperations.deleteNode(acc, nodeId, parentId, userId)
    }, Object.assign({}, state))
  },

  [NODE_CONTENT_UPDATE]: (state, action) => {
    const { nodeId, content, userId } = action.payload
    return Object.assign({}, state, {
      [nodeId]: nodeOperations.updateContent(state[nodeId], content, userId)
    })
  },

  [NODE_FOCUS]: (state, action) => {
    return nodeOperations.focus(state, action.payload.nodeId, action.payload.focusNotes)
  },

  [NODE_UNFOCUS]: (state, action) => {
    return Object.assign({}, state, {
      [action.payload.nodeId]: nodeOperations.unfocus(state[action.payload.nodeId])
    })
  },

  [NODE_DEMOTION]: (state, action) => {
    const { nodeId, currentParentId, newParentId,
            addNodeAfterNewSiblingId, userId } = action.payload

    const newState = nodeOperations.reassignParent(state, nodeId, currentParentId, newParentId, addNodeAfterNewSiblingId, userId)

    return nodeOperations.focus(newState, nodeId, false)
  },

  [NODE_PROMOTION]: (state, action) => {
    let newState = Object.assign({}, state)
    const { nodeId, userId, currentParentId, newParentId, siblingIds } = action.payload

    // reassign all siblings below to the promoted node
    for (let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++) {
      let sibling = newState[siblingIds[i]]
      newState = nodeOperations.reassignParent(newState, sibling.id, sibling.parentId, nodeId, userId)
    }

    // reassign the node to its parent's parent
    nodeOperations.reassignParent(newState, nodeId, currentParentId, newParentId, currentParentId, userId)

    return nodeOperations.focus(newState, nodeId, false)
  },

  [NODE_EXPANSION_TOGGLE]: (state, action) => {
    let newState = Object.assign({}, state)
    const { nodeId, forceToggleChildrenExpansion, userId } = action.payload
    const allDescendantIds = forceToggleChildrenExpansion
                              ? nodeSelectors.getAllDescendantIds(state, nodeId)
                              : nodeSelectors.getAllUncollapsedDescedantIds(nodeId, state, nodeId)
    if (state[nodeId].collapsedBy[userId]) {
      // TODO: dispatch(nodeFirebaseActions.expandNode(nodeId, state.auth.id)))
      newState = nodeOperations.expand(newState, [ nodeId, ...allDescendantIds ], userId)
    } else {
      // TODO: dispatch(nodeFirebaseActions.collapseNode(nodeId, state.auth.id))
      newState = nodeOperations.collapse(newState, [ nodeId, ...allDescendantIds ], userId)
    }

    return newState
  },

  [NODE_COLLAPSE]: (state, action) => {
    const { nodeId, forceCollapseChildren, userId } = action.payload
    const allDescendantIds = forceCollapseChildren
                              ? nodeSelectors.getAllDescendantIds(state, nodeId)
                              : nodeSelectors.getAllUncollapsedDescedantIds(nodeId, state, nodeId)
    return nodeOperations.collapse(state, [ nodeId, ...allDescendantIds ], userId)
  },

  [NODE_EXPANSION]: (state, action) => {
    const { nodeId, forceCollapseChildren, userId } = action.payload
    const allDescendantIds = forceCollapseChildren
                              ? nodeSelectors.getAllDescendantIds(state, nodeId)
                              : nodeSelectors.getAllUncollapsedDescedantIds(nodeId, state, nodeId)
    return nodeOperations.expand(state, [ nodeId, ...allDescendantIds ], userId)
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
    return Object.assign({}, state, {
      [nodeId]: nodeOperations.complete(state[nodeId], userId)
    })
  },

  [NODES_COMPLETION]: (state, action) => {

  },

  [NODE_NOTES_UPDATE]: (state, action) => {
    const { nodeId, notes, userId } = action.payload
    return Object.assign({}, state, {
      [nodeId]: nodeOperations.updateNotes(state[nodeId], notes, userId)
    })
  },

  [NODE_DISPLAY_MODE_UPDATE]: (state, action) => {

  },

  [NODE_TAG_ADDITION]: (state, action) => {

  },

  [NODE_TAG_REMOVAL]: (state, action) => {

  }

})
