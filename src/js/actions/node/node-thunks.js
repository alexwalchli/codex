import urlWidget from '../../widgets/url-widget'
import stockTickerWidget from '../../widgets/stock-ticker-widget'
import { ActionCreators } from 'redux-undo'
import { firebaseDb } from '../../firebase'
import nodeFactory from '../../utilities/node-factory'
import * as nodeActions from './node-actions'
import { dictionaryToArray, getPresentNodes, getRootNodeId, getAllDescendantIds, getNextNodeThatIsVisible,
        getCurrentlySelectedNodeIds, getCurrentlyFocusedNodeId, getAllUncollapsedDescedantIds }
  from '../../utilities/tree-queries'
import * as firebaseActions from '../firebase/'

// /////////////////////
// Utilities
// /////////////////////

function getUpdatedChildIdsForAddition (addChildToNode, newNodeId, createdFromSiblingId, createdFromSiblingOffset) {
  let updatedChildIds

  if (addChildToNode.childIds.includes(newNodeId)) {
    // don't add the child ID if it's already been added
    return addChildToNode.childIds
  }

  if (createdFromSiblingId) {
    // if the child was created from a specific node, add it in front or behind the node it was created from based on the offset
    updatedChildIds = [...addChildToNode.childIds]
    updatedChildIds.splice(addChildToNode.childIds.indexOf(createdFromSiblingId) + createdFromSiblingOffset, 0, newNodeId)
  } else {
    // prepend the childId by default
    updatedChildIds = [newNodeId, ...addChildToNode.childIds]
  }

  return updatedChildIds
}

// attaches a node to a new parent node and optimistically updates local app store
export const generateEventsForReassignParentNode = (dispatch, nodeId, oldParentId, newParentId, addAfterSiblingId, appState) => {
  let optimisticEvents = []
  const updatedById = appState.auth.id

  // remove child from its current parent
  let oldParentChildIds = getPresentNodes(appState)[oldParentId].childIds
  let updatedChildIdsForOldParent = oldParentChildIds.filter(id => id !== nodeId)
  optimisticEvents.push(nodeActions.childIdsUpdated(oldParentId, updatedChildIdsForOldParent, updatedById))

  // update the parent Id of the child
  optimisticEvents.push(nodeActions.nodeParentUpdated(nodeId, newParentId, updatedById))

  // add the child to its new parent
  let newParentNode = appState.tree.present[newParentId]
  let updatedChildIdsForNewParent = getUpdatedChildIdsForAddition(newParentNode, nodeId, addAfterSiblingId, 1)
  optimisticEvents.push(nodeActions.childIdsUpdated(newParentId, updatedChildIdsForNewParent, updatedById))

  dispatch(firebaseActions.reassignParentNode(nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, appState.auth.id))

  return optimisticEvents
}

// /////////////////////
// Actions
// /////////////////////

export const NODE_TRANSACTION = 'NODE_TRANSACTION'

export const nodeTransaction = (events) => {
  return {
    type: NODE_TRANSACTION,
    payload: events
  }
}

// optimistically creates a node in client state then pushes to persistence
export const createNode = (originNodeId, originOffset, content) =>
  (dispatch, getState) => {
    console.log(firebaseDb)
    const appState = getState()
    const nodes = getPresentNodes(appState)
    const originNode = nodes[originNodeId]
    const parentOfNewNode = nodes[originNode.childIds.length === 0 || originNode.collapsed ? originNode.parentId : originNodeId]
    const newNodeId = firebaseDb.ref('nodes').push().key
    let optimisticEvents = []
    // if the node was created from a node with children AND it is not collapsed, add the node to it, else add the node to created from node's parent
    let newNode = nodeFactory(newNodeId, parentOfNewNode.id, [], content, getState().auth.id)
    let updatedParentChildIds = getUpdatedChildIdsForAddition(parentOfNewNode, newNodeId, originNodeId, originOffset)

    optimisticEvents.push(nodeActions.nodeCreated(newNode))
    optimisticEvents.push(nodeActions.childIdsUpdated(parentOfNewNode.id, updatedParentChildIds, appState.auth.id))
    if (originOffset > 0) {
      // if we're adding the new node below the current then focus on the new node, else stay focused on the current node
      let nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes)
      let nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes)

      nodeIdsToDeselect.forEach(id => optimisticEvents.push(nodeActions.nodeDeselected(id)))
      optimisticEvents.push(nodeActions.nodeUnfocused(nodeIdToUnfocus))
      optimisticEvents.push(nodeActions.nodeFocused(newNodeId))
    }

    dispatch(nodeTransaction(optimisticEvents))
    dispatch(firebaseActions.createNode(newNode, appState.app.currentUserPageId, updatedParentChildIds))
  }

export const updateContent = (nodeId, newContent) =>
  (dispatch, getState) => {
    const appState = getState()
    dispatch(firebaseActions.updateNodeContent(nodeId, newContent, appState.auth.id))
    dispatch(nodeActions.contentUpdated(nodeId, newContent))
  }

export const focusNode = (nodeId, focusNotes) =>
  (dispatch, getState) => {
    const appState = getState()
    const nodes = getPresentNodes(appState)
    const nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes)
    let events = []

    const nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes)
    nodeIdsToDeselect.forEach(id => {
      events.push(nodeActions.nodeDeselected(id))
    })

    events.push(nodeActions.nodeUnfocused(nodeIdToUnfocus))
    events.push(nodeActions.nodeFocused(nodeId, focusNotes))
    dispatch(nodeTransaction(events))

    if (nodeIdToUnfocus) {
      dispatch(firebaseActions.updateNodeSelectedByUser(nodeIdToUnfocus, null, null))
    }
    dispatch(firebaseActions.updateNodeSelectedByUser(nodeId, appState.auth.id, appState.auth.displayName))
  }

// TODO: Combine with focusNodeBelow
export const focusNodeAbove = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = getRootNodeId(state)
    const nodeToFocus = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(state), currentNodeId, true)

    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocused(nodeToFocus.id))
    }
  }

export const focusNodeBelow = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = getRootNodeId(state)
    const nodeToFocus = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(state), currentNodeId, false)

    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocused(nodeToFocus.id))
    }
  }

export const demoteNode = (nodeId, parentId) =>
  (dispatch, getState) => {
    const appState = getState()
    const rootNodeId = getRootNodeId(appState)
    const siblingAbove = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(appState), nodeId, true)
    const addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1]

    dispatch(nodeTransaction(generateEventsForReassignParentNode(dispatch, nodeId, parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId, appState)))
    dispatch(nodeActions.nodeFocused(nodeId))
  }

export const promoteNode = (nodeId, parentId) =>
  (dispatch, getState) => {
    const appState = getState()
    const nodes = getPresentNodes(appState)
    const parentNode = nodes[parentId]
    const siblingIds = parentNode.childIds
    let optimisticEvents = []

    // reassign all siblings below to the promoted node
    for (let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++) {
      let sibling = nodes[siblingIds[i]]
      optimisticEvents.push(generateEventsForReassignParentNode(dispatch, sibling.id, sibling.parentId, nodeId, appState))
    }
    optimisticEvents = [ ...optimisticEvents, ...generateEventsForReassignParentNode(dispatch, nodeId, parentId, parentNode.parentId, parentId, appState) ]
    dispatch(nodeTransaction(optimisticEvents))
    dispatch(nodeActions.nodeFocused(nodeId))
  }

export const deleteNode = (nodeId) =>
  (dispatch, getState) => {
    let nodes = getPresentNodes(getState())
    if (Object.keys(nodes).length > 2) {
      const appState = getState()
      let nodeToDelete = nodes[nodeId]
      let updatedParentChildIds = nodes[nodeToDelete.parentId].childIds.filter(id => id !== nodeId)
      let descendantIdsOfNode = getAllDescendantIds(nodes, nodeId)

      dispatch(nodeActions.childIdsUpdated(nodeToDelete.parentId, updatedParentChildIds))
      dispatch(nodeActions.nodesDeleted([nodeId]))
      dispatch(firebaseActions.deleteNode(nodeToDelete, updatedParentChildIds, descendantIdsOfNode, appState.auth.id))
    }
  }

export const deleteNodes = (nodeIds) => (dispatch, getState) => {
  const appState = getState()
  const nodes = getPresentNodes(appState)

  let reducerTransaction = []
  let nodesToDeleteFromDatabase = []
  let updatedParentNodeChildIds = {}

  if (Object.keys(nodes).length > 2) {
    nodeIds.forEach(nodeId => {
      let nodeToDelete = nodes[nodeId]
      let parentNode = nodes[nodeToDelete.parentId]
      let parentNodeUpdatedChildIds = updatedParentNodeChildIds[nodeToDelete.parentId]
      let descendantIdsOfNode = getAllDescendantIds(nodes, nodeId)

      if (!parentNodeUpdatedChildIds) {
        parentNodeUpdatedChildIds = parentNode.childIds
      }
      parentNodeUpdatedChildIds.remove(nodeToDelete.id)
      nodesToDeleteFromDatabase.push({id: nodeId, parentId: nodeToDelete.parentId, parentChildIds: parentNodeUpdatedChildIds, allDescendentIds: descendantIdsOfNode})
      reducerTransaction.push(nodeActions.removeChildNode(nodeToDelete.parentId, nodeId))
    })
  }
  // TODO: /childIds gets set wrong
  reducerTransaction.push(nodeActions.nodesDeleted(nodeIds))
  dispatch(nodeTransaction(reducerTransaction))
  dispatch(firebaseActions.deleteNodes(nodesToDeleteFromDatabase, appState.auth.id))
}

export const toggleNodeExpansion = (nodeId, forceToggleChildrenExpansion) =>
  (dispatch, getState) => {
    const nodes = getPresentNodes(getState())
    const allDescendentIds = forceToggleChildrenExpansion
                              ? getAllDescendantIds(nodes, nodeId)
                              : getAllUncollapsedDescedantIds(nodeId, nodes, nodeId)
    if (nodes[nodeId].collapsed) {
      dispatch(nodeActions.nodeExpanded(nodeId, allDescendentIds))
    } else {
      dispatch(nodeActions.nodeCollapsed(nodeId, allDescendentIds))
    }
  }

export const searchNodes = (query) =>
  (dispatch, getState) => {
    const appState = getState()
    let nodes = dictionaryToArray(getPresentNodes(appState))
    let resultingNodeIds = nodes.filter(node => {
      if (node.id === getRootNodeId(appState)) {
        return true
      } else if (!query) {
        return true
      } else if (!node.content) {
        return false
      }

      return node.content.includes(query)
    }).map(node => { return node.id })

    dispatch(nodeActions.nodesSearched(resultingNodeIds))
  }

// TODO: Sync FirebaseDb
export const undo = () =>
  (dispatch, getState) => {
    // const appState = getState()
    // const currentTreeState = getPresentNodes(appState)
    // const undoneTreeState = getPresentNodes(appState)

    dispatch(ActionCreators.undo())
    // let differences = treeDiffer(currentTreeState, undoneTreeState)
  }

// TODO: Sync FirebaseDb
export const redo = () =>
  (dispatch) => {
    // const appState = getState()
    // const currentTreeState = getPresentNodes(appState)
    // const redoneTreeState = getPresentNodes(appState)

    dispatch(ActionCreators.redo())
    // let differences = treeDiffer(currentTreeState, redoneTreeState)
  }

export const selectNode = (nodeId) =>
  (dispatch, getState) => {
    // TODO: let other collaborators know this user has selected this node
    const appState = getState()
    const allDescendentIds = getAllDescendantIds(getPresentNodes(appState), nodeId)
    let reducerTransaction = []

    reducerTransaction.push(nodeActions.nodeSelected(nodeId))
    allDescendentIds.forEach(descedentId => {
      reducerTransaction.push(nodeActions.nodeSelected(descedentId))
    })

    dispatch(nodeTransaction(reducerTransaction))
  }

export const deselectNode = (nodeId) =>
  (dispatch, getState) => {
    // TODO: let other collaborators know this user has deselected this node
    const appState = getState()
    const allDescendentIds = getAllDescendantIds(getPresentNodes(appState), nodeId)
    let reducerTransaction = []

    reducerTransaction.push(nodeActions.nodeDeselected(nodeId))
    allDescendentIds.forEach(descedentId => {
      reducerTransaction.push(nodeActions.nodeDeselected(descedentId))
    })

    dispatch(nodeTransaction(reducerTransaction))
  }

export const updateNodeWidgetDataIfNecessary = (nodeId, content) =>
  (dispatch, getState) => {
    const node = getState().tree.present[nodeId]
    let widgetPromises = []

    dispatch(nodeActions.nodeWidgetDataUpdating(nodeId))

    if (content) {
      widgetPromises.push(urlWidget.parse(node))
      widgetPromises.push(stockTickerWidget.parse(node))
    }

    // TODO: user-defined widgets

    Promise.all(widgetPromises).then(widgetResults => {
      let allWidgets = widgetResults.reduce((prevValue, currValue) => {
        if (currValue) {
          return [ prevValue, ...currValue ]
        }
      }, [])

      dispatch(nodeActions.nodeWidgetsUpdated(nodeId, allWidgets || []))
    })
  }

export const toggleNodeMenu = (nodeId) =>
  dispatch => {
    dispatch(nodeActions.closeAllMenusAndDeselectAllNodes(nodeId))
    dispatch(nodeActions.nodeMenuToggled(nodeId))
  }

export const toggleNodeComplete = (nodeId) =>
  (dispatch, getState) => {
    const appState = getState()
    const node = getPresentNodes(appState)[nodeId]

    dispatch(nodeActions.nodeCompleteToggled(nodeId))
    dispatch(firebaseActions.updateNodeComplete(nodeId, !node.completed, appState.auth.id))
  }

export const completeNodes = (nodeIds) =>
  (dispatch, getState) => {
    dispatch(nodeActions.nodesCompleted(nodeIds))
    dispatch(firebaseActions.completeNodes(nodeIds))
    dispatch(nodeActions.closeAllMenusAndDeselectAllNodes())
  }

export const updateNodeNotes = (nodeId, notes) =>
  (dispatch, getState) => {
    const appState = getState()
    dispatch(nodeActions.nodeNotesUpdated(nodeId, notes))
    dispatch(firebaseActions.updateNodeNotes(nodeId, notes, appState.auth.id))
  }

export const updateNodeDisplayMode = (nodeId, mode) =>
  (dispatch, getState) => {
    const appState = getState()
    dispatch(nodeActions.nodeDisplayModeUpdated(nodeId, mode))
    dispatch(firebaseActions.updateNodeDisplayMode(nodeId, mode, appState.auth.id))
  }
