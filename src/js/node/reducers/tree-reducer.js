// the new tree reducer in progress
import { reducerFactory } from '../../redux/reducer-factory'
import * as nodeFirebaseActions from '../actions/node-firebase-actions'
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
  NODE_SELECTION,
  NODE_DESELECTION,
  NODE_COMPLETION_TOGGLE,
  NODES_COMPLETION,
  NODE_NOTES_UPDATE,
  NODE_DISPLAY_MODE_UPDATE,
  NODE_TAG_ADDITION,
  NODE_TAG_REMOVAL
} from '../actions/node-action-types'

export const tree = reducerFactory({

  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    const { initialTreeState, rootNodeId } = action.payload
    const rootNode = initialTreeState[rootNodeId]

    return nodeOperations.focus(action.payload.initialTreeState, rootNode.childIds[0], false)
  },

  [NODE_CREATION]: (state, action) => {
    let newState = Object.assign({}, state)
    const { nodeId, originNodeId, originOffset, content, userPageId, userId } = action.payload
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

    const { nodeId, content } = action.payload
    return Object.assign({}, state, {
      [nodeId]: nodeOperations.updateContent(state[nodeId], content)
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
    const { nodeId, rootNodeId, visibleNodes, userId } = action.payload
    const siblingAbove = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, state, visibleNodes, nodeId, true)
    const addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1]

    newState = nodeOperations.reassignParent(state, nodeId, parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId, userId)))
    return nodeOperations.focus(newState, nodeId, false)
  },

  [NODE_PROMOTION]: (state, action) => {

  },

  [NODE_EXPANSION_TOGGLE]: (state, action) => {

  },

  [NODE_SELECTION]: (state, action) => {

  },

  [NODE_DESELECTION]: (state, action) => {

  },

  [NODE_COMPLETION_TOGGLE]: (state, action) => {

  },

  [NODES_COMPLETION]: (state, action) => {

  },

  [NODE_NOTES_UPDATE]: (state, action) => {

  },

  [NODE_DISPLAY_MODE_UPDATE]: (state, action) => {

  },

  [NODE_TAG_ADDITION]: (state, action) => {

  },

  [NODE_TAG_REMOVAL]: (state, action) => {

  }

})
