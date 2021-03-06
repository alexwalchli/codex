import { ActionCreators } from 'redux-undo'
import * as nodeActions from './node-actions'
import * as nodeSelectors from './node-selectors'
import * as nodeRepository from './node-repository'
import * as userPageSelectors from '../userpage/userpage-selectors'

export const createNode = (originNodeId, originOffset, content) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    const userId = state.auth.get('id')
    const newNodeId = nodeRepository.getNewNodeId()
    const originNode = treeState.get(originNodeId)
    const parentId = originNode.get('childIds').count() === 0 || originNode.getIn(['collapsedBy', userId])
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
      userPageSelectors.currentPageId(state),
      userId))
  }

export const moveNode = (nodeId, newParentId) => (dispatch, getState) => {
  const state = getState()
  const currentParentId = nodeSelectors.getNode(state, nodeId).parentId
  const userId = state.auth.get('id')

  dispatch(nodeActions.nodeMove(nodeId, newParentId, currentParentId, userId))
}

export const deleteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const treeState = nodeSelectors.currentTreeState(state)
    const userId = state.auth.get('id')

    if (nodeSelectors.getNodeCount(state) === 2) {
      // this is the last node before the root
      return
    }

    const allDescendantIds = nodeSelectors.getAllDescendantIds(treeState, nodeId)
    const parentId = treeState.getIn([nodeId, 'parentId'])

    dispatch(nodeActions.nodeDeletion(nodeId, parentId, allDescendantIds, userId))
  }

export const deleteNodes = (nodeIds) =>
  (dispatch, getState) => {
    const state = getState()

    if (nodeIds.length - 2 > nodeSelectors.getNodeCount(state)) {
      // TODO: warn/confirm and then need to add back an initial node if they delete everything
    }

    dispatch(nodeActions.nodesDeleted(nodeIds))
  }

export const updateNodeContent = (nodeId, content, tags) =>
  (dispatch, getState) => {
    const state = getState()
    const userId = state.auth.get('id')

    dispatch(nodeActions.nodeContentUpdate(nodeId, content, userId, tags))
  }

export const updateNodeNotes = (nodeId, notes, tags) => (dispatch, getState) => {
  const state = getState()
  const userId = state.auth.get('id')

  dispatch(nodeActions.nodeNotesUpdate(nodeId, notes, tags, userId))
}

export const focusNode = (nodeId, focusNotes) => (dispatch) => {
  dispatch(nodeActions.nodeFocus(nodeId, focusNotes))
}

export const focusNodeAbove = (currentNodeId, anchorPosition) => (dispatch, getState) => {
  const state = getState()
  const rootNodeId = nodeSelectors.getRootNodeId(state)
  const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(
    rootNodeId, nodeSelectors.currentTreeState(state), state.visibleNodes.present, currentNodeId, true
  )

  if (nodeToFocus) {
    dispatch(nodeActions.nodeFocus(nodeToFocus.get('id'), false, anchorPosition))
  }
}

export const focusNodeBelow = (currentNodeId, anchorPosition) => (dispatch, getState) => {
  const state = getState()
  const rootNodeId = nodeSelectors.getRootNodeId(state)
  const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(
    rootNodeId, nodeSelectors.currentTreeState(state), state.visibleNodes.present, currentNodeId, false
  )

  if (nodeToFocus) {
    dispatch(nodeActions.nodeFocus(nodeToFocus.get('id'), false, anchorPosition))
  }
}

export const demoteNode = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const treeState = nodeSelectors.currentTreeState(state)
  const rootNodeId = nodeSelectors.getRootNodeId(state)
  const currentParentId = treeState.getIn([nodeId, 'parentId'])
  const userId = state.auth.get('id')
  const addAfterSibling = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, treeState, state.visibleNodes.present, nodeId, true)

  if (!addAfterSibling || addAfterSibling.get('id') === currentParentId) {
    // can't demote the node when there isn't a sibling above to attach it too
    return
  }

  const newParentId = addAfterSibling.get('id')
  const addAfterLastChildOfSiblingAboveId = addAfterSibling.get('childIds')[addAfterSibling.get('childIds').count() - 1]

  dispatch(nodeActions.nodeDemotion(
    nodeId,
    currentParentId,
    newParentId,
    addAfterLastChildOfSiblingAboveId,
    state.visibleNodes.present,
    userId)
  )
}

export const promoteNode = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const treeState = nodeSelectors.currentTreeState(state)
  const node = treeState.get(nodeId)
  const parentNode = treeState.get(node.get('parentId'))
  const currentParentId = parentNode.get('id')
  const newParentId = parentNode.get('parentId')
  const siblingIds = parentNode.get('childIds')
  const userId = state.auth.get('id')

  if (currentParentId === nodeSelectors.getRootNodeId(state)) {
    return
  }

  dispatch(nodeActions.nodePromotion(
    nodeId,
    siblingIds,
    currentParentId,
    newParentId,
    state.visibleNodes.present,
    userId)
  )
}

export const toggleNodeExpansion = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const userId = state.auth.get('id')
  const treeState = nodeSelectors.currentTreeState(state)
  const allDescendentIds = nodeSelectors.getAllDescendantIds(treeState, nodeId)
  const uncollapsedDescendantIds = nodeSelectors.getVisibleNodesIfNodeWasExpanded(nodeId, treeState, nodeId, userId)

  if (treeState.getIn([nodeId, 'collapsedBy', userId])) {
    dispatch(nodeActions.nodeExpansion(nodeId, allDescendentIds, uncollapsedDescendantIds, userId))
  } else {
    dispatch(nodeActions.nodeCollapse(nodeId, allDescendentIds, userId))
  }
}

export const selectNode = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeSelection(nodeId))
}

export const deselectNode = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeDeselection(nodeId))
}

export const toggleNodeComplete = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const userId = state.auth.get('id')

  dispatch(nodeActions.nodeCompletionToggle(nodeId, userId))
}

export const closeAllNodeMenus = () => (dispatch, getState) => {
  dispatch(nodeActions.nodeAllMenusClose())
}

export const toggleNodeMenu = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeAllMenusClose(nodeId))
  dispatch(nodeActions.nodeMenuToggle(nodeId))
}

export const shiftNodeUp = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const node = nodeSelectors.getNode(state, nodeId)

  dispatch(nodeActions.nodeShiftUp(nodeId, node.parentId))
}

export const shiftNodeDown = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const node = nodeSelectors.getNode(state, nodeId)

  dispatch(nodeActions.nodeShiftDown(nodeId, node.parentId))
}

export const copyNodeUp = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const node = nodeSelectors.getNode(state, nodeId)
  const newNodeId = nodeRepository.getNewNode()

  dispatch(nodeActions.nodeCopyUp(nodeId, node.parentId, newNodeId))
}

export const copyNodeDown = (nodeId) => (dispatch, getState) => {
  const state = getState()
  const node = nodeSelectors.getNode(state, nodeId)
  const newNodeId = nodeRepository.getNewNodeId()

  dispatch(nodeActions.nodeCopyDown(nodeId, node.parentId, newNodeId))
}

export const undo = () => (dispatch) => {
  dispatch(ActionCreators.undo())
}

export const redo = () => (dispatch) => {
  dispatch(ActionCreators.redo())
}

export const nodeSubscriptionOnAdded = (node) => (dispatch, getState) => {
  dispatch(nodeActions.nodeAdditionFromSubscription(node))
}

export const nodeSubscriptionOnUpdated = (node) => (dispatch, getState) => {
  dispatch(nodeActions.nodeUpdateFromSubscription(node))
}

export const nodeSubscriptionOnDeleted = (nodeId) => (dispatch, getState) => {
  dispatch(nodeActions.nodeDeletionFromSubscription(nodeId))
}
