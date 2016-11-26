// import { ActionCreators } from 'redux-undo'
import * as nodeActions from './node-actions'
import * as nodeSelectors from '../selectors/node-selectors'
import * as nodeRepository from '../repositories/node-repository'

export const createNode = (originNodeId, originOffset, content) =>
  (dispatch, getState) => {
    const state = getState()
    const newNodeId = nodeRepository.getNewNodeId()
    dispatch(nodeActions.nodeCreation(newNodeId, originNodeId, originOffset, content, state.app.currentUserPageId, state.auth.id))
  }

export const deleteNode = (nodeId, content) =>
  (dispatch, getState) => {
    const state = getState()
    dispatch(nodeActions.nodeDeletion(nodeId, content, state.auth.id))
  }

export const updateNodeContent = (nodeId, content) =>
  (dispatch, getState) => {
    const state = getState()
    dispatch(nodeActions.nodeContentUpdate(nodeId, content, state.auth.id))
  }

export const focusNode = (nodeId, focusNotes) =>
  (dispatch) => {
    dispatch(nodeActions.nodeFocus(nodeId, focusNotes))
  }

export const focusNodeAbove = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, nodeSelectors.getPresentNodes(state), state.visibleNodes.present, currentNodeId, true)
    console.log(nodeToFocus)
    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocus(nodeToFocus.id))
    }
  }

export const focusNodeBelow = (currentNodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const nodeToFocus = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, nodeSelectors.getPresentNodes(state), state.visibleNodes.present, currentNodeId, false)

    if (nodeToFocus) {
      dispatch(nodeActions.nodeFocus(nodeToFocus.id))
    }
  }

export const demoteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)

    dispatch(nodeActions.nodeDemotion(nodeId, rootNodeId, state.visibleNodes.present, state.auth.id))
  }

export const promoteNode = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const rootNodeId = nodeSelectors.getRootNodeId(state)

    dispatch(nodeActions.nodePromotion(nodeId, rootNodeId, state.visibleNodes.present, state.auth.id))
  }

export const toggleNodeExpansion = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()
    const nodes = nodeSelectors.getPresentNodes(state)
    const allDescendentIds = nodeSelectors.getAllDescendantIds(nodes, nodeId)
    const rootNodeId = nodeSelectors.getRootNodeId(state)
    const allUncollapsedDescendantIds = nodeSelectors.getAllUncollapsedDescedantIds(rootNodeId, nodes, nodeId, state.auth.id)

    if (nodeSelectors.getPresentNodes(state)[nodeId].collapsedBy[state.auth.id]) {
      dispatch(nodeActions.nodeExpansion(nodeId, allDescendentIds, allUncollapsedDescendantIds, state.auth.id))
    } else {
      dispatch(nodeActions.nodeCollapse(nodeId, allDescendentIds, state.auth.id))
    }
  }

export const selectNode = (nodeId) =>
  (dispatch, getState) => {
    dispatch(nodeActions.nodeSelection(nodeId))
  }

export const deselectNode = (nodeId) =>
  (dispatch, getState) => {
    dispatch(nodeActions.nodeDeselection(nodeId))
  }

export const toggleNodeComplete = (nodeId) =>
  (dispatch, getState) => {
    const state = getState()

    dispatch(nodeActions.nodeCompletionToggle(nodeId, state.auth.id))
  }

export const toggleNodeMenu = (nodeId) =>
  (dispatch, getState) => {
    dispatch(nodeActions.allNodeMenuClose())
    dispatch(nodeActions.nodeMenuToggle(nodeId))
  }

// old action creators

// function getUpdatedChildIdsForAddition (addChildToNode, newNodeId, createdFromSiblingId, createdFromSiblingOffset) {
//   let updatedChildIds

//   if (addChildToNode.childIds.includes(newNodeId)) {
//     // don't add the child ID if it's already been added
//     return addChildToNode.childIds
//   }

//   if (createdFromSiblingId) {
//     // if the child was created from a specific node, add it in front or behind the node it was created from based on the offset
//     updatedChildIds = [...addChildToNode.childIds]
//     updatedChildIds.splice(addChildToNode.childIds.indexOf(createdFromSiblingId) + createdFromSiblingOffset, 0, newNodeId)
//   } else {
//     // prepend the childId by default
//     updatedChildIds = [newNodeId, ...addChildToNode.childIds]
//   }

//   return updatedChildIds
// }

// // attaches a node to a new parent node and optimistically updates local app store
// export const generateEventsForReassignParentNode = (dispatch, nodeId, oldParentId, newParentId, addAfterSiblingId, appState) => {
//   let optimisticEvents = []
//   const updatedById = appState.auth.id

//   // remove child from its current parent
//   let oldParentChildIds = nodeSelectors.getPresentNodes(appState)[oldParentId].childIds
//   let updatedChildIdsForOldParent = oldParentChildIds.filter(id => id !== nodeId)
//   optimisticEvents.push(nodeActions.childIdsUpdated(oldParentId, updatedChildIdsForOldParent, updatedById))

//   // update the parent Id of the child
//   optimisticEvents.push(nodeActions.nodeParentUpdated(nodeId, newParentId, updatedById))

//   // add the child to its new parent
//   let newParentNode = appState.tree.present[newParentId]
//   let updatedChildIdsForNewParent = getUpdatedChildIdsForAddition(newParentNode, nodeId, addAfterSiblingId, 1)
//   optimisticEvents.push(nodeActions.childIdsUpdated(newParentId, updatedChildIdsForNewParent, updatedById))

//   dispatch(nodeRepository.reassignParentNode(nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, appState.auth.id))

//   return optimisticEvents
// }

// // optimistically creates a node in client state and pushes to persistence
// // export const createNode = (originNodeId, originOffset, content) =>
// //   (dispatch, getState) => {
// //     const appState = getState()
// //     const nodes = nodeSelectors.getPresentNodes(appState)
// //     const originNode = nodes[originNodeId]
// //     const parentOfNewNode = nodes[originNode.childIds.length === 0 || originNode.collapsed ? originNode.parentId : originNodeId]
// //     const newNodeId = nodeFirebaseActions.getNewNodeId()
// //     let nodeTransaction = []
// //     // if the node was created from a node with children AND it is not collapsed, add the node to it, else add the node to created from node's parent
// //     let newNode = nodeFactory(newNodeId, parentOfNewNode.id, [], content, getState().auth.id)
// //     let updatedParentChildIds = getUpdatedChildIdsForAddition(parentOfNewNode, newNodeId, originNodeId, originOffset)

// //     nodeTransaction.push(nodeActions.nodeCreated(newNode))
// //     nodeTransaction.push(nodeActions.childIdsUpdated(parentOfNewNode.id, updatedParentChildIds, appState.auth.id))
// //     if (originOffset > 0) {
// //       // if we're adding the new node below the current then focus on the new node, else stay focused on the current node
// //       let nodeIdsToDeselect = nodeSelectors.getCurrentlySelectedNodeIds(nodes)
// //       let nodeIdToUnfocus = nodeSelectors.getCurrentlyFocusedNodeId(nodes)

// //       nodeIdsToDeselect.forEach(id => nodeTransaction.push(nodeActions.nodeDeselected(id)))
// //       nodeTransaction.push(nodeActions.nodeUnfocused(nodeIdToUnfocus))
// //       nodeTransaction.push(nodeActions.nodeFocused(newNodeId))
// //     }

// //     dispatch(nodeFirebaseActions.createNode(newNode, appState.app.currentUserPageId, updatedParentChildIds))
// //     dispatch(nodeActions.nodeTransaction(nodeTransaction))
// //   }

// // export const updateContent = (nodeId, newContent) =>
// //   (dispatch, getState) => {
// //     const appState = getState()
// //     const node = nodeSelectors.getPresentNodes(appState)[nodeId]

// //     node.taggedByIds.forEach(tagId => {
// //       if (!newContent.toLowerCase().includes(tagId)) {
// //         dispatch(removeTagFromNode(nodeId, tagId))
// //       }
// //     })

// //     dispatch(nodeFirebaseActions.updateNodeContent(nodeId, newContent, appState.auth.id))
// //     dispatch(nodeActions.contentUpdated(nodeId, newContent, appState.auth.id))
// //   }

// // export const focusNode = (nodeId, focusNotes) =>
// //   (dispatch, getState) => {
// //     const appState = getState()
// //     const nodes = nodeSelectors.getPresentNodes(appState)
// //     const nodeIdToUnfocus = nodeSelectors.getCurrentlyFocusedNodeId(nodes)
// //     let events = []

// //     const nodeIdsToDeselect = nodeSelectors.getCurrentlySelectedNodeIds(nodes)
// //     nodeIdsToDeselect.forEach(id => {
// //       events.push(nodeActions.nodeDeselected(id))
// //     })

// //     events.push(nodeActions.nodeUnfocused(nodeIdToUnfocus))
// //     events.push(nodeActions.nodeFocused(nodeId, focusNotes))
// //     dispatch(nodeActions.nodeTransaction(events))

// //     if (nodeIdToUnfocus) {
// //       dispatch(nodeFirebaseActions.updateNodeSelectedByUser(nodeIdToUnfocus, null, null))
// //     }
// //     dispatch(nodeFirebaseActions.updateNodeSelectedByUser(nodeId, appState.auth.id, appState.auth.displayName))
// //   }

// // export const demoteNode = (nodeId, parentId) =>
// //   (dispatch, getState) => {
// //     const appState = getState()
// //     const rootNodeId = nodeSelectors.getRootNodeId(appState)
// //     const siblingAbove = nodeSelectors.getNextNodeThatIsVisible(rootNodeId, nodeSelectors.getPresentNodes(appState), appState.visibleNodes.present, nodeId, true)
// //     const addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1]

// //     dispatch(nodeActions.nodeTransaction(generateEventsForReassignParentNode(dispatch, nodeId, parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId, appState)))
// //     dispatch(nodeActions.nodeFocused(nodeId))
// //   }

// export const promoteNode = (nodeId, parentId) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     const nodes = nodeSelectors.getPresentNodes(appState)
//     const parentNode = nodes[parentId]
//     const siblingIds = parentNode.childIds
//     let optimisticEvents = []

//     // reassign all siblings below to the promoted node
//     for (let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++) {
//       let sibling = nodes[siblingIds[i]]
//       optimisticEvents.push(generateEventsForReassignParentNode(dispatch, sibling.id, sibling.parentId, nodeId, appState))
//     }
//     optimisticEvents = [ ...optimisticEvents, ...generateEventsForReassignParentNode(dispatch, nodeId, parentId, parentNode.parentId, parentId, appState) ]
//     dispatch(nodeActions.nodeTransaction(optimisticEvents))
//     dispatch(nodeActions.nodeFocused(nodeId))
//   }

// export const deleteNode = (nodeId) =>
//   (dispatch, getState) => {
//     let nodes = nodeSelectors.getPresentNodes(getState())
//     if (Object.keys(nodes).length > 2) {
//       const appState = getState()
//       let nodeToDelete = nodes[nodeId]
//       let updatedParentChildIds = nodes[nodeToDelete.parentId].childIds.filter(id => id !== nodeId)
//       let descendantIdsOfNode = nodeSelectors.getAllDescendantIds(nodes, nodeId)

//       dispatch(nodeActions.childIdsUpdated(nodeToDelete.parentId, updatedParentChildIds))
//       dispatch(nodeActions.nodesDeleted([nodeId]))
//       dispatch(nodeFirebaseActions.deleteNode(nodeToDelete, updatedParentChildIds, descendantIdsOfNode, appState.auth.id))
//     }
//   }

// export const deleteNodes = (nodeIds) => (dispatch, getState) => {
//   const appState = getState()
//   const nodes = nodeSelectors.getPresentNodes(appState)

//   let reducerTransaction = []
//   let nodesToDeleteFromDatabase = []
//   let updatedParentNodeChildIds = {}

//   if (Object.keys(nodes).length > 2) {
//     nodeIds.forEach(nodeId => {
//       let nodeToDelete = nodes[nodeId]
//       let parentNode = nodes[nodeToDelete.parentId]
//       let parentNodeUpdatedChildIds = updatedParentNodeChildIds[nodeToDelete.parentId]
//       let descendantIdsOfNode = nodeSelectors.getAllDescendantIds(nodes, nodeId)

//       if (!parentNodeUpdatedChildIds) {
//         parentNodeUpdatedChildIds = parentNode.childIds
//       }
//       parentNodeUpdatedChildIds.remove(nodeToDelete.id)
//       nodesToDeleteFromDatabase.push({id: nodeId, parentId: nodeToDelete.parentId, parentChildIds: parentNodeUpdatedChildIds, allDescendentIds: descendantIdsOfNode})
//       reducerTransaction.push(nodeActions.removeChildNode(nodeToDelete.parentId, nodeId))
//     })
//   }
//   // TODO: /childIds gets set wrong
//   reducerTransaction.push(nodeActions.nodesDeleted(nodeIds))
//   dispatch(nodeActions.nodeTransaction(reducerTransaction))
//   dispatch(nodeFirebaseActions.deleteNodes(nodesToDeleteFromDatabase, appState.auth.id))
// }

// export const toggleNodeExpansion = (nodeId, forceToggleChildrenExpansion) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     const nodes = nodeSelectors.getPresentNodes(appState)
//     const allDescendentIds = forceToggleChildrenExpansion
//                               ? nodeSelectors.getAllDescendantIds(nodes, nodeId)
//                               : nodeSelectors.getAllUncollapsedDescedantIds(nodeId, nodes, nodeId)
//     if (nodes[nodeId].collapsedBy[appState.auth.id]) {
//       dispatch(nodeFirebaseActions.expandNode(nodeId, appState.auth.id))
//       dispatch(nodeActions.nodeExpanded(nodeId, allDescendentIds, appState.auth.id))
//     } else {
//       dispatch(nodeFirebaseActions.collapseNode(nodeId, appState.auth.id))
//       dispatch(nodeActions.nodeCollapsed(nodeId, allDescendentIds, appState.auth.id))
//     }
//   }

// export const searchNodes = (query) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     let nodes = nodeSelectors.dictionaryToArray(nodeSelectors.getPresentNodes(appState))
//     let resultingNodeIds = nodes.filter(node => {
//       if (node.id === nodeSelectors.getRootNodeId(appState)) {
//         return true
//       } else if (!query) {
//         return true
//       } else if (!node.content) {
//         return false
//       }

//       return node.content.includes(query)
//     }).map(node => { return node.id })

//     dispatch(nodeActions.nodesSearched(resultingNodeIds))
//   }

// // TODO: Sync FirebaseDb
// export const undo = () =>
//   (dispatch, getState) => {
//     // const appState = getState()
//     // const currentTreeState = getPresentNodes(appState)
//     // const undoneTreeState = getPresentNodes(appState)

//     dispatch(ActionCreators.undo())
//     // let differences = treeDiffer(currentTreeState, undoneTreeState)
//   }

// // TODO: Sync FirebaseDb
// export const redo = () =>
//   (dispatch) => {
//     // const appState = getState()
//     // const currentTreeState = getPresentNodes(appState)
//     // const redoneTreeState = getPresentNodes(appState)

//     dispatch(ActionCreators.redo())
//     // let differences = treeDiffer(currentTreeState, redoneTreeState)
//   }

// export const selectNode = (nodeId) =>
//   (dispatch, getState) => {
//     // TODO: let other collaborators know this user has selected this node
//     const appState = getState()
//     const allDescendentIds = nodeSelectors.getAllDescendantIds(nodeSelectors.getPresentNodes(appState), nodeId)
//     let reducerTransaction = []

//     reducerTransaction.push(nodeActions.nodeSelected(nodeId))
//     allDescendentIds.forEach(descedentId => {
//       reducerTransaction.push(nodeActions.nodeSelected(descedentId))
//     })

//     dispatch(nodeActions.nodeTransaction(reducerTransaction))
//   }

// export const deselectNode = (nodeId) =>
//   (dispatch, getState) => {
//     // TODO: let other collaborators know this user has deselected this node
//     const appState = getState()
//     const allDescendentIds = nodeSelectors.getAllDescendantIds(nodeSelectors.getPresentNodes(appState), nodeId)
//     let reducerTransaction = []

//     reducerTransaction.push(nodeActions.nodeDeselected(nodeId))
//     allDescendentIds.forEach(descedentId => {
//       reducerTransaction.push(nodeActions.nodeDeselected(descedentId))
//     })

//     dispatch(nodeActions.nodeTransaction(reducerTransaction))
//   }

// export const toggleNodeMenu = (nodeId) =>
//   dispatch => {
//     dispatch(nodeActions.closeAllMenusAndDeselectAllNodes(nodeId))
//     dispatch(nodeActions.nodeMenuToggled(nodeId))
//   }

// export const toggleNodeComplete = (nodeId) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     const node = nodeSelectors.getPresentNodes(appState)[nodeId]

//     dispatch(nodeActions.nodeCompleteToggled(nodeId))
//     dispatch(nodeFirebaseActions.updateNodeComplete(nodeId, !node.completed, appState.auth.id))
//   }

// export const completeNodes = (nodeIds) =>
//   (dispatch, getState) => {
//     dispatch(nodeActions.nodesCompleted(nodeIds))
//     dispatch(nodeFirebaseActions.completeNodes(nodeIds))
//     dispatch(nodeActions.closeAllMenusAndDeselectAllNodes())
//   }

// export const updateNodeNotes = (nodeId, notes) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     dispatch(nodeActions.nodeNotesUpdated(nodeId, notes))
//     dispatch(nodeFirebaseActions.updateNodeNotes(nodeId, notes, appState.auth.id))
//   }

// export const updateNodeDisplayMode = (nodeId, mode) =>
//   (dispatch, getState) => {
//     const appState = getState()
//     dispatch(nodeActions.nodeDisplayModeUpdated(nodeId, mode))
//     dispatch(nodeFirebaseActions.updateNodeDisplayMode(nodeId, mode, appState.auth.id))
//   }

// export const addTagToNode = (nodeId, tagId) =>
//   (dispatch, getState) => {
//     dispatch(nodeActions.tagAdded(nodeId, tagId))
//     // TODO: dispatch(nodeFirebaseActions.updateNodeTags(nodeId, tags)
//   }

// export const removeTagFromNode = (nodeId, tagId) =>
//     (dispatch, getState) => {
//       dispatch(nodeActions.tagRemoved(nodeId, tagId))
//       // TODO: dispatch(nodeFirebaseActions.updateNodeTags(nodeId, tags))
//     }
