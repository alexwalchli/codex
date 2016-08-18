import fetch from 'isomorphic-fetch';
import Endpoints from '../endpoints';
import urlWidget from '../widgets/url-widget';
import stockTickerWidget from '../widgets/stock-ticker-widget';
import { ActionCreators } from 'redux-undo';
import { firebaseDb } from '../firebase';
import nodeFactory from '../utilities/node-factory';
import { dictionaryToArray, getPresentNodes, getRootNodeId, getAllDescendantIds, getSiblingNodeAbove, getNextNodeThatIsVisible, 
         getCurrentlySelectedAndFocusedNodes, getCurrentlySelectedNodeIds, getCurrentlyFocusedNodeId, getAllUncollapsedDescedantIds } 
    from '../utilities/state-queries';

let initialized = false;
export const NODE_TRANSACTION = 'NODE_TRANSACTION';

///////////////////
// Action Creators 
// Always Returns functions that perform I/O and dispatch one or more events and are not not handled by Reducers.
///////////////////

export function subscribeToNodes(userPageId){
    return (dispatch, getState) => {
        // TODO: limit to userPage's allDescendentNodeIds array...

        // do an initial load of the user's nodes and then subscribe to changes to each node
        const nodeRef = firebaseDb.ref('nodes');
        nodeRef.once('value').then(snapshot => {

            // load the nodes into state
            dispatch({
                type: INITIAL_NODE_STATE_LOADED,
                payload: unwrapNodesSnapshot(snapshot)
            });
            
            nodeRef.on('child_added', snapshot => {
                let nodeDoesNotExistsInAppState = !getPresentNodes(getState())[snapshot.key];
                if(initialized && nodeDoesNotExistsInAppState){
                    dispatch(nodeCreated(unwrapNodeSnapshot(snapshot)));
                }
            });

            nodeRef.on('child_changed', snapshot => {
                let appState = getState();
                let nodeWasNotChangedByCurrentUser = getPresentNodes(appState)[snapshot.key].lastUpdatedById !== appState.auth.id;
                if(initialized && nodeWasNotChangedByCurrentUser){
                    dispatch(nodeUpdated(unwrapNodeSnapshot(snapshot)));
                }
            });

            nodeRef.on('child_removed', snapshot => {
                let nodeExistsInAppState = getPresentNodes(getState())[snapshot.key];
                if(initialized && nodeExistsInAppState){
                    dispatch(nodesDeleted([snapshot.key]));
                }
            });

            setTimeout(() => {
                initialized = true;
            }, 0);
        });

    };
}

// optimistically creates a node in client state then pushes to persistence
export function createNode(createdFromSiblingId, createdFromSiblingOffset, parentId, content) {
    return (dispatch, getState) => {
        let appState = getState();
        let nodes = getPresentNodes(appState);
        let optimisticEvents = [];
        let nodeRef = firebaseDb.ref('nodes');
        let newNodeId = nodeRef.push().key;
        let newNodeRef = firebaseDb.ref('nodes/' + newNodeId);
        let createdFromSiblingNode = getState().tree.present[createdFromSiblingId];
         // if the node was created from a node with children, add the node to it, else add the node to created from node's parent
        let addNewNodeToNodeId = createdFromSiblingNode.childIds.length === 0 ? parentId : createdFromSiblingId;
        let addNewNodeToNode = getPresentNodes(getState())[addNewNodeToNodeId];
        let parentNodeChildIdsRef = firebaseDb.ref('nodes/' + addNewNodeToNodeId + '/childIds');
        let newNode = nodeFactory(newNodeId, parentId, [], content, getState().auth.id);
        let updatedChildIds = getUpdatedChildIdsForAddition(addNewNodeToNode, newNodeId, createdFromSiblingId, createdFromSiblingOffset);
        
        optimisticEvents.push(nodeCreated(newNode));
        optimisticEvents.push(childIdsUpdated(addNewNodeToNodeId, updatedChildIds, appState.auth.id));
        if(createdFromSiblingOffset > 0){
            // if we're adding the new node below the current then focus on the new node, else stay focused on the current node
            let nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes);
            let nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes);
            nodeIdsToDeselect.forEach(id => optimisticEvents.push(nodeDeselected(id)));
            optimisticEvents.push(nodeUnfocused(nodeIdToUnfocus));
            optimisticEvents.push(nodeFocused(newNodeId));
        }

        dispatch(nodeTransaction(optimisticEvents));

        newNodeRef.update(newNode).catch(error => alert(error));
        parentNodeChildIdsRef.update(updatedChildIds);
    };
}

function nodeTransaction(events){
    return {
        type: NODE_TRANSACTION,
        payload: events
    };
}

export function updateContent(nodeId, content) {
    return (dispatch) => {
        firebaseDb.ref('nodes/' + nodeId + '/content').set(content);
        dispatch(contentUpdated(nodeId, content));
    };
}

export function focusNode(nodeId){
    return (dispatch, getState) => {
        let nodes = getPresentNodes(getState());
        let nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes);
        let nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes);
        let events = [];
        nodeIdsToDeselect.forEach(id => events.push(nodeDeselected(id)));
        events.push(nodeUnfocused(nodeIdToUnfocus));
        events.push(nodeFocused(nodeId));
        dispatch(nodeTransaction(events));
    };
}

// TODO: Combine with focusNodeBelow
export function focusNodeAbove(currentNodeId){
    return (dispatch, getState) => {
        const state = getState();
        const rootNodeId = getRootNodeId(state);
        let nodeToFocus = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(state), currentNodeId, true);
        if(nodeToFocus){
            dispatch(focusNode(nodeToFocus.id));
        } 
    };
}

export function focusNodeBelow(currentNodeId){
    return (dispatch, getState) => {
        const state = getState();
        const rootNodeId = getRootNodeId(state);
        let nodeToFocus = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(state), currentNodeId, false);
        if(nodeToFocus){
            dispatch(focusNode(nodeToFocus.id));
        } 
    };
}

export function demoteNode(nodeId, parentId){
    return (dispatch, getState) => {
        const state = getState();
        var siblingAbove = getSiblingNodeAbove(getPresentNodes(state), nodeId, parentId);
        var addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1];
        dispatch(reassignParentNode(nodeId, parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId));
        dispatch(nodeFocused(nodeId));
    };
}

export function promoteNode(nodeId, parentId){
    return (dispatch, getState) => {
        const appState = getState();
        const nodes = getPresentNodes(appState);
        let parentNode = nodes[parentId];

        // reassign all siblings below to the promoted node
        var siblingIds = parentNode.childIds;
        for(let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++){
            let sibling = nodes[siblingIds[i]];
            dispatch(reassignParentNode(sibling.id, sibling.parentId, nodeId));
        }

        dispatch(reassignParentNode(nodeId, parentId, parentNode.parentId, parentId));
        dispatch(nodeFocused(nodeId));
    };
}

// attaches a node to a new parent node and optimistically updates local app store
function reassignParentNode(nodeId, oldParentId, newParentId, addAfterSiblingId){
   return (dispatch, getState) => {
        let optimisticEvents = [];
        const appState = getState();
        const updatedById = appState.auth.id;
        
        // remove child from its current parent
        let oldParentChildIds = getPresentNodes(appState)[oldParentId].childIds;
        let updatedChildIdsForOldParent = oldParentChildIds.filter(id => id !== nodeId);
        optimisticEvents.push(childIdsUpdated(oldParentId, updatedChildIdsForOldParent, updatedById));

        // update the parent Id of the child
        optimisticEvents.push(nodeParentUpdated(nodeId, newParentId, updatedById));

        // add the child to its new parent
        let newParentNode = appState.tree.present[newParentId];
        let updatedChildIdsForNewParent = getUpdatedChildIdsForAddition(newParentNode, nodeId, addAfterSiblingId, 1);
        optimisticEvents.push(childIdsUpdated(newParentId, updatedChildIdsForNewParent, updatedById));

        const nodeParentIdRef = firebaseDb.ref('nodes/' + nodeId);
        const nodeChildIdsRef = firebaseDb.ref('nodes/' + oldParentId);
        const parentNodeRef = firebaseDb.ref('nodes/' + newParentId);
        nodeChildIdsRef.update({ childIds: updatedChildIdsForOldParent, lastUpdatedById: updatedById });
        parentNodeRef.update({ childIds: updatedChildIdsForNewParent, lastUpdatedById: updatedById });
        nodeParentIdRef.update({ parentId: newParentId, lastUpdatedById: updatedById });

        dispatch(nodeTransaction(optimisticEvents));
   }; 
}

export function removeChild(nodeId, childId) {
    return (dispatch, getState) => {
        const appState = getState();
        let childIds = getPresentNodes(appState)[nodeId].childIds;
        let updatedChildIds = childIds.filter(id => id !== childId);
        dispatch(childIdsUpdated(nodeId, updatedChildIds));

        const nodeChildIdsRef = firebaseDb.ref('nodes/' + nodeId);
        nodeChildIdsRef.update({ childIds: updatedChildIds, lastUpdatedById: appState.auth.id });
    };
}

export function deleteNode(nodeId, parentId) {
    return (dispatch, getState) => {
        let nodes = getPresentNodes(getState());
        if(Object.keys(nodes).length > 2){
            let descendantIds = getAllDescendantIds(nodes, nodeId);
            let nodeIdsToDelete = [ nodeId, ...descendantIds ];
            dispatch(removeChild(parentId, nodeId));
            nodeIdsToDelete.forEach(id => firebaseDb.ref('nodes/' + id).remove());
        }
    };
}

export function toggleNodeExpansion(nodeId){
    return (dispatch, getState) => {
        const nodes = getPresentNodes(getState());
        var allDescendentIds = getAllUncollapsedDescedantIds(nodes, nodeId);
        if(nodes[nodeId].collapsed){
            dispatch(nodeExpanded(nodeId, allDescendentIds));
        } else {
            dispatch(nodeCollapsed(nodeId, allDescendentIds));
        }
    };
}

export function searchNodes(query){
    return (dispatch, getState) => {
        const appState = getState();
        let nodes = dictionaryToArray(getPresentNodes(appState));
        let resultingNodeIds = nodes.filter(node => {
            if(node.id === getRootNodeId(appState)) {
                return true;
            } else if(!query){
                return true;
            } else if(!node.content){
                return false;
            }

            return node.content.includes(query);
        }).map(node => { return node.id; });

        dispatch(nodesSearched(resultingNodeIds));
    };
}

export function undo() {
     return (dispatch) => {
         dispatch(ActionCreators.undo());
     };
}

export function redo() {
     return (dispatch) => {
         dispatch(ActionCreators.redo());
     };
}

export function selectNode(nodeId){
    return (dispatch, getState) => {
        // TODO: let other collaborators know this user has selected this node
        dispatch(nodeSelected(nodeId));
    };
}

export function deselectNode(nodeId){
    return (dispatch, getState) => {
        // TODO: let other collaborators know this user has deselected this node
        dispatch(nodeDeselected(nodeId));
    };
}

export function updateNodeWidgetDataIfNecessary(nodeId, content){
    var morphedContent = content;

    return (dispatch, getState) => {
        var node = getState().tree.present[nodeId];
        
        dispatch(nodeWidgetDataUpdating(nodeId));

        var widgetPromises = [];
        if(content){
            widgetPromises.push(urlWidget.parse(node));
            widgetPromises.push(stockTickerWidget.parse(node));
        }
        
        // TODO: user-defined widgets

        Promise.all(widgetPromises).then(widgetResults => {
            var allWidgets = widgetResults.reduce((prevValue, currValue) => {
                if(currValue){
                    return[ prevValue, ...currValue];
                }
            }, []);

            dispatch(nodeWidgetsUpdated(nodeId, allWidgets || []));
        });
    };
}

///////////////////
// Actions 
// Always return plain objects of facts that have happened via commands. They are handled by Reducers to update this clients state.
///////////////////

export const NODE_CREATED = 'NODE_CREATED';
export const NODE_UPDATED = 'NODE_UPDATED';
export const INITIAL_NODE_STATE_LOADED = 'INITIAL_NODE_STATE_LOADED';
export const CONTENT_UPDATED = 'CONTENT_UPDATED';
export const CHILD_IDS_UPDATED = 'CHILD_IDS_UPDATED'; // fired when a node's child ID has been added/deleted/moved 
export const NODE_PARENT_UPDATED = 'NODE_PARENT_UPDATED'; // a node's parent ID is updated
export const NODES_DELETED = 'NODES_DELETED';
export const NODE_EXPANSION_TOGGLED = 'NODE_EXPANSION_TOGGLED';
export const NODE_SHOWN = 'NODE_SHOWN';
export const NODE_HIDDEN = 'NODE_HIDDEN';
export const NODE_COLLAPSED = 'NODE_COLLAPSED';
export const NODE_EXPANDED = 'NODE_EXPANDED';
export const NODE_FOCUSED = 'NODE_FOCUSED';
export const NODE_UNFOCUSED = 'NODE_UNFOCUSED';
export const NODE_SELECTED = 'NODE_SELECTED';
export const NODE_DESELECTED = 'NODE_DESELECTED';
export const NODES_SEARCHED = 'NODES_SEARCHED';
export const NODE_WIDGETS_UPDATED = "NODE_WIDGETS_UPDATED"; // signifies a node that has had its widget data updated
export const NODE_WIDGETS_UPDATING = "NODE_WIDGETS_UPDATING"; // signifies a node that is having its widget data updated

export function nodeCreated(newNode){
    return {
        type: NODE_CREATED,
        nodeId: newNode.id,
        payload: newNode
    };
}

export function nodeUpdated(updatedNode){
    return {
        type: NODE_UPDATED,
        nodeId: updatedNode.id,
        payload: updatedNode
    };
}

export function contentUpdated(nodeId, content, updatedById){
    return {
        type: CONTENT_UPDATED,
        nodeId,
        payload: {
            content,
            updatedById
        }
    };
}

export function childIdsUpdated(nodeId, newChildIds, updatedById){
    return {
        type: CHILD_IDS_UPDATED,
        nodeId,
        payload: {
            newChildIds,
            updatedById    
        } 
    };
}

export function nodesDeleted(nodeIds) {
    return {
        type: NODES_DELETED,
        payload: nodeIds
    };
}

export function nodeExpanded(nodeId, allDescendentIds){
    return {
        type: NODE_EXPANDED,
        nodeId,
        payload: allDescendentIds
    };
}

export function nodeCollapsed(nodeId, allDescendentIds){
    return {
        type: NODE_COLLAPSED,
        nodeId,
        payload: allDescendentIds
    };
}

export function nodeFocused(nodeId){
    return {
        type: NODE_FOCUSED,
        nodeId
    };
}

export function nodeUnfocused(nodeId){
    return {
        type: NODE_UNFOCUSED,
        nodeId
    };
}

export function nodeDeselected(nodeId){
    return {
        type: NODE_DESELECTED,
        nodeId
    };
}

export function nodeSelected(nodeId){
    return {
        type: NODE_SELECTED,
        nodeId
    };
}

export function nodeParentUpdated(nodeId, newParentId, updatedById){
    return {
        type: NODE_PARENT_UPDATED,
        nodeId,
        payload: {
            newParentId,
            updatedById    
        }
    };
}

export function nodesSearched(nodeIds){
    return {
        type: NODES_SEARCHED,
        payload: {
            resultingNodeIds: nodeIds
        }
    };
}

export function nodeWidgetsUpdated(nodeId, widgets){
    return {
        type: NODE_WIDGETS_UPDATED,
        nodeId,
        widgets
    };
}

export function nodeWidgetDataUpdating(nodeId){
    return {
        type: NODE_WIDGETS_UPDATING,
        nodeId
    };
}

///////////////////////
// Utilities
///////////////////////

function unwrapNodesSnapshot(nodesSnapshot){
    let nodes = nodesSnapshot.val();
    let unwrappedNodes = {};
    Object.keys(nodes).forEach(nodeId => {
        let unwrappedNode = nodes[nodeId];
        unwrappedNode.childIds = unwrappedNode.childIds || [];
        unwrappedNodes[nodeId] = unwrappedNode;
    });

    return unwrappedNodes;
}

function unwrapNodeSnapshot(nodeSnapshot){
    let node = nodeSnapshot.val();
    node.childIds = node.childIds || [];
    return node;
}

function getUpdatedChildIdsForAddition(addChildToNode, newNodeId, createdFromSiblingId, createdFromSiblingOffset){
    let updatedChildIds;    
    
    if(addChildToNode.childIds.includes(newNodeId)){
        // don't add the child ID if it's already been added
        return addChildToNode.childIds;
    }

    if(createdFromSiblingId){
        // if the child was created from a specific node, add it in front or behind the node it was created from based on the offset
        updatedChildIds = [...addChildToNode.childIds];
        updatedChildIds.splice(addChildToNode.childIds.indexOf(createdFromSiblingId) + createdFromSiblingOffset, 0, newNodeId);
    } else {
        // prepend the childId by default
        updatedChildIds = [newNodeId, ...addChildToNode.childIds];
    }

    return updatedChildIds;
}

