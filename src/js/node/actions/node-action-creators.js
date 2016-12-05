// import { ActionCreators } from 'redux-undo'
import * as nodeActions from './node-actions'
import * as nodeSelectors from '../selectors/node-selectors'
import * as nodeRepository from '../repositories/node-repository'

export const createNode = (originNodeId, originOffset, content) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    const userId = state.getIn(['auth', 'id'])
    const newNodeId = nodeRepository.getNewNodeId()
    const originNode = treeState.get(originNodeId)
    const parentId = originNode.get('childIds').count() === 0 || originNode.getIn(['collapsed', userId])
                      ? originNode.get('parentId')
                      : originNodeId

    let nodeIdsToDeselect = []
    let nodeIdToUnfocus = null
    if (originOffset > 0) {
      nodeIdsToDeselect = nodeSelectors.getCurrentlySelectedNodeIds(treeState)
      nodeIdToUnfocus = nodeSelectors.getCurrentlyFocusedNodeId(treeState)
    }

    dispatch(nodeActions.nodeCreation(
      newNodeId,
      originNodeId,
      parentId,
      nodeIdsToDeselect,
      nodeIdToUnfocus,
      originOffset,
      content,
      state.getIn(['app', 'currentUserPageId']),
      userId))

    const newState = getState()
    const newTreeState = nodeSelectors.currentTreeState(newState)
    nodeRepository.createNode(newTreeState.get(newNodeId), state.getIn('app', 'currentUserPageId'), newTreeState.getIn(parentId, 'childIds'))
  }

export const deleteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)

    if (Object.keys(treeState).length === 2) {
      // this is the last node before the root
      return
    }

    const allDescendantIds = nodeSelectors.getAllDescendantIds(treeState, nodeId)
    const parentId = treeState[nodeId].parentId

    dispatch(nodeActions.nodeDeletion(nodeId, parentId, allDescendantIds, state.auth.id))

    const newState = getState()
    const newTreeState = nodeSelectors.currentTreeState(newState)
    nodeRepository.deleteNode(nodeId, parentId, newTreeState[parentId].childIds, allDescendantIds, state.auth.id)
  }

export const deleteNodes = (nodeIds) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    if (nodeIds.length - 2 > Object.keys(treeState).length) {
      // need to add back an initial node if they delete everything
    }

    dispatch(nodeActions.nodesDeleted(nodeIds))

    nodeRepository.deleteNodes(nodeIds)
  }

export const updateNodeContent = (nodeId, content) =>
  (dispatch, getState) => {
    const state = getState()

    dispatch(nodeActions.nodeContentUpdate(nodeId, content, state.getIn(['auth', 'id'])))

    nodeRepository.updateNode(nodeSelectors.currentTreeState(getState())[nodeId])
  }

export const focusNode = (nodeId, focusNotes) =>
  (dispatch) => {
    dispatch(nodeActions.nodeFocus(nodeId, focusNotes))
  }

export const focusNodeAbove = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, nodeSelectors.currentTreeState(state), state.getIn(['visibleNodes', 'present']), currentNodeId, true)

    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocus(nodeToFocus.get('id')))
    }
  }

export const focusNodeBelow = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, nodeSelectors.currentTreeState(state), state.getIn(['visibleNodes', 'present']), currentNodeId, false)

    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocus(nodeToFocus.get('id')))
    }
  }

export const demoteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const currentParentId = treeState.getIn([nodeId, 'parentId'])
    const visibleNodes = state.getIn(['visibleNodes', 'present'])
    const userId = state.getIn(['auth', 'id'])
    const addAfterSibling = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, treeState, visibleNodes, nodeId, true)
    console.log(addAfterSibling)
    if (!addAfterSibling || addAfterSibling.id === currentParentId) {
      // can't demote the node when there isn't a sibling above to attach it too
      return
    }
    const newParentId = addAfterSibling.get('id')
    const addAfterLastChildOfSiblingAboveId = addAfterSibling.get('childIds')[addAfterSibling.get('childIds').count() - 1]

    dispatch(nodeActions.nodeDemotion(
      nodeId,
      rootNodeId,
      currentParentId,
      newParentId,
      addAfterLastChildOfSiblingAboveId,
      visibleNodes,
      userId))

    const newTreeState = nodeSelectors.currentTreeState(getState())
    nodeRepository.reassignParentNode(
      nodeId,
      currentParentId,
      newParentId,
      newTreeState.getIn([currentParentId, 'childIds']),
      newTreeState.getIn([newParentId, 'childIds']),
      userId)
  }

export const promoteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    const node = treeState.get(nodeId)
    const parentNode = treeState.get(node.get('parentId'))
    const currentParentId = parentNode.get('id')
    const newParentId = parentNode.get('parentId')
    const siblingIds = parentNode.get('childIds')
    const userId = state.getIn(['auth', 'id'])
    const visibleNodes = state.getIn(['visibleNodes', 'present'])
    if (currentParentId === nodeSelectors.getRootNodeId(state)) {
      return
    }

    dispatch(nodeActions.nodePromotion(nodeId, siblingIds, currentParentId, newParentId, visibleNodes, userId))

    // side effect, syncAction, syncNodes,
    const newTreeState = nodeSelectors.currentTreeState(getState())
    const oldParentForSiblings = newTreeState.get(currentParentId)
    const promotedNode = newTreeState.get(nodeId)
    siblingIds.forEach(siblingId => {
      nodeRepository.reassignParentNode(siblingId, currentParentId, nodeId, oldParentForSiblings.get('childIds'), promotedNode.get('childIds'), userId)
    })
    const newParentForPromotedNode = newTreeState.get(newParentId)
    nodeRepository.reassignParentNode(nodeId, currentParentId, newParentId, oldParentForSiblings.get('childIds'), newParentForPromotedNode.get('childIds'), userId)
  }

export const toggleNodeExpansion = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const nodes = nodeSelectors.currentTreeState(state)
    const allDescendentIds = nodeSelectors.getAllDescendantIds(nodes, nodeId)
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const allUncollapsedDescendantIds = nodeSelectors.getAllUncollapsedDescedantIds(rootNodeId, nodes, nodeId, state.auth.id)

    if (nodeSelectors.currentTreeState(state)[nodeId].collapsedBy[state.auth.id]) {
      dispatch(nodeActions.nodeExpansion(nodeId, allDescendentIds, allUncollapsedDescendantIds, state.auth.id))
    } else {
      dispatch(nodeActions.nodeCollapse(nodeId, allDescendentIds, state.auth.id))
    }

    const newTreeState = nodeSelectors.currentTreeState(getState())
    nodeRepository.updateNode(newTreeState[nodeId])
  }

export const selectNode = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeSelection(nodeId))
}

export const deselectNode = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeDeselection(nodeId))
}

export const toggleNodeComplete = (nodeId) => (dispatch, getState) => {
  const state = getState()

  dispatch(nodeActions.nodeCompletionToggle(nodeId, state.auth.id))
}

export const toggleNodeMenu = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.allNodeMenuClose())
  dispatch(nodeActions.nodeMenuToggle(nodeId))
}
