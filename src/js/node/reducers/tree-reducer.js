// the new tree reducer in progress
import { reducerFactory } from '../../redux/reducer-factory'
import * as nodeOperations from '../operations/node-operations'
import * as nodeSelectors from '../selectors/node-selectors'
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
  NODE_TAG_REMOVAL
} from '../actions/node-action-types'

export const tree = reducerFactory({}, {

  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    const { initialTreeState, rootNodeId } = action.payload
    const rootNode = initialTreeState[rootNodeId]

    return nodeOperations.focus(action.payload.initialTreeState, rootNode.childIds[0], false)
  },

  [NODE_CREATION]: (state, action) => {
    let newState = Object.assign({}, state)
    const { nodeId, originNodeId, originOffset, content, userId } = action.payload
    const originNode = state[originNodeId]
    const parentOfNewNode = state[originNode.childIds.length === 0 || originNode.collapsed ? originNode.parentId : originNodeId]

    newState[nodeId] = nodeOperations.create(nodeId, parentOfNewNode.id, [], content, userId)
    newState[parentOfNewNode.id] = nodeOperations.addChild(parentOfNewNode, nodeId, originNodeId, originOffset)

    if (originOffset > 0) {
      const nodeIdsToDeselect = nodeSelectors.getCurrentlySelectedNodeIds(state)
      const nodeIdToUnfocus = nodeSelectors.getCurrentlyFocusedNodeId(state)

      newState[nodeIdToUnfocus] = nodeOperations.unfocus(newState[nodeIdToUnfocus])
      nodeIdsToDeselect.forEach(nodeIdToUnfocus => {
        newState[nodeId] = nodeOperations.deselectNode(newState[nodeIdToUnfocus])
      })

      newState[nodeId] = nodeOperations.focus(newState[nodeId])
    }

    // TODO: nodeFirebaseActions.createNode(newState[nodeId], userPageId, parentOfNewNode.childIds)

    return newState
  },

  [NODES_DELETION]: (state, action) => {
    let newState = Object.assign({}, state)
    const { nodeIds } = action.payload.nodeIds

    nodeIds.forEach(nodeId => {
      newState[nodeId] = nodeOperations.deleteNode(newState[nodeId])
    })

    return newState
  },

  [NODE_DELETION]: (state, action) => {

  },

  [NODE_CONTENT_UPDATE]: (state, action) => {
    // TODO: nodeFirebaseActions.updateNodeContent(nodeId, newContent, appState.auth.id)

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
    // TODO: update Firebase

    const { nodeId, rootNodeId, visibleNodes, userId } = action.payload
    const siblingAbove = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, state, visibleNodes, nodeId, true)
    const addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1]

    const newState = nodeOperations.reassignParent(state, nodeId, state[nodeId].parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId, userId)
    return nodeOperations.focus(newState, nodeId, false)
  },

  [NODE_PROMOTION]: (state, action) => {
    // TODO: update Firebase

    let newState = Object.assign({}, state)
    const { nodeId, userId } = action.payload
    const parentId = state[nodeId].parentId
    const parentNode = state[parentId]
    const siblingIds = parentNode.childIds

    // reassign all siblings below to the promoted node
    for (let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++) {
      let sibling = newState[siblingIds[i]]
      newState = nodeOperations.reassignParent(newState, sibling.id, sibling.parentId, nodeId, userId)
    }

    // reassign the node to its parent's parent
    nodeOperations.reassignParent(newState, nodeId, parentNode.id, parentNode.parentId, parentId, userId)

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
