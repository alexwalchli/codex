import fetch from 'isomorphic-fetch';
import Endpoints from '../endpoints';
import urlWidget from '../widgets/url-widget';
import stockTickerWidget from '../widgets/stock-ticker-widget';
import { ActionCreators } from 'redux-undo';
import { firebaseDb } from '../firebase';
import nodeFactory from '../utilities/node-factory';
import { dictionaryToArray, getPresentNodes, getRootNodeId, getAllDescendantIds, getSiblingNodeAbove, getNextNodeThatIsVisible, 
         getCurrentlySelectedAndFocusedNodes, getCurrentlySelectedNodeIds, getCurrentlyFocusedNodeId, getAllUncollapsedDescedantIds } 
    from '../utilities/tree-queries';
import treeDiffer from '../utilities/tree-differ';
import * as dbRepository from '../repositories/database-repository';

let initialized = false;
export const NODE_TRANSACTION = 'NODE_TRANSACTION';

/////////////////////
// Action Creators //
/////////////////////

export function subscribeToNodes(){
    return (dispatch, getState) => {
        // do an initial load of the user's nodes based on the current user page's descendantIds
        // and then subscribe to changes on each node
        let appState = getState(),
            currentUserPage =  appState.userPages[appState.app.currentUserPageId],
            initialNodeState = {},
            initialNodePromises = [];

        // collection of all node Ids for this userPage and user
        let userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id);
        userPageUserNodesRef.once('value').then(userPageUsersNodesSnapshot => {
            let nodeIds = Object.keys(userPageUsersNodesSnapshot.val());

            dispatch(subscribeToUserPageUserNodes(appState.app.currentUserPageId));

            // retrieve all nodes and then subscribe to each
            nodeIds.forEach(descendantId => {
                let nodeRef = firebaseDb.ref('nodes/' + descendantId),
                nodePromise = new Promise((resolve, reject) => {
                    nodeRef.once('value').then(snapshot => {
                        let node = unwrapNodeSnapshot(snapshot);

                        initialNodeState[descendantId] = node;
                        dispatch(subscribeToNode(node.id));

                        resolve();
                    });
                });
                initialNodePromises.push(nodePromise);
            });

            Promise.all(initialNodePromises).then(() => {
                dispatch({
                    type: INITIAL_NODE_STATE_LOADED,
                    payload: initialNodeState
                });

                initialized = true;
            });

        });
    };
}

export function subscribeToUserPageUserNodes(userPageId){
    return (dispatch, getState) => {
        const appState = getState();
        const userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id);

        userPageUserNodesRef.on('child_added', snapshot => {
            let nodeId = snapshot.key,
                nodeDoesNotExistsInAppState = !getPresentNodes(getState())[nodeId];
            if(initialized && nodeDoesNotExistsInAppState){
                dbRepository.getNodeSnapshot(nodeId).then(node => {
                    dispatch(subscribeToNode(nodeId));
                    dispatch(nodeCreated(node));
                });
            }
        });

        userPageUserNodesRef.on('child_removed', snapshot => {
            let nodeId = snapshot.key,
                nodeDoesNotExistsInAppState = !getPresentNodes(getState())[nodeId];
            if(initialized && nodeDoesNotExistsInAppState){
                dispatch(nodesDeleted([nodeId]));
            }
        });
    };
}

export function subscribeToNode(nodeId){
    return (dispatch, getState) => {
        const nodeRef = firebaseDb.ref('nodes/' + nodeId),
              nodeChildIdsRef = firebaseDb.ref('nodes/' + nodeId + '/childIds');

        nodeRef.on('value', snapshot => {
            const appState = getState(),
            nodes = getPresentNodes(appState),
            updatedNode = unwrapNodeSnapshot(snapshot);

            if(initialized && updatedNode){
                let nodeWasJustCreatedButNotByCurrentUser = updatedNode.lastUpdatedById === undefined && updatedNode.createdById !== appState.auth.id;
                let nodeWasNotUpdatedByCurrentUser = updatedNode.lastUpdatedById !== appState.auth.id;
                
                if(nodeWasJustCreatedButNotByCurrentUser && nodeWasNotUpdatedByCurrentUser){
                    dispatch(nodeUpdated(updatedNode));
                }
            }

        });

        nodeChildIdsRef.on('child_added', snapshot => {
        
        });

        nodeChildIdsRef.on('child_removed', snapshot => {

            let nodeExistsInAppState = getPresentNodes(getState())[snapshot.key];
            if(initialized && nodeExistsInAppState){
                dispatch(nodesDeleted([snapshot.key]));
            }   

        });
    };
}

// optimistically creates a node in client state then pushes to persistence
export function createNode(createdFromSiblingId, createdFromSiblingOffset, parentId, content) {
    return (dispatch, getState) => {
        let appState = getState(),
            nodes = getPresentNodes(appState),
            optimisticEvents = [],
            newNodeId = firebaseDb.ref('nodes').push().key,
            createdFromSiblingNode = getState().tree.present[createdFromSiblingId],
            // if the node was created from a node with children, add the node to it, else add the node to created from node's parent
            addNewNodeToNodeId = createdFromSiblingNode.childIds.length === 0 ? parentId : createdFromSiblingId,
            addNewNodeToNode = getPresentNodes(getState())[addNewNodeToNodeId],
            newNode = nodeFactory(newNodeId, addNewNodeToNodeId, [], content, getState().auth.id),
            updatedParentChildIds = getUpdatedChildIdsForAddition(addNewNodeToNode, newNodeId, createdFromSiblingId, createdFromSiblingOffset);
        
        optimisticEvents.push(nodeCreated(newNode));
        optimisticEvents.push(childIdsUpdated(addNewNodeToNodeId, updatedParentChildIds, appState.auth.id));
        if(createdFromSiblingOffset > 0){
            // if we're adding the new node below the current then focus on the new node, else stay focused on the current node
            let nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes);
            let nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes);
            nodeIdsToDeselect.forEach(id => optimisticEvents.push(nodeDeselected(id)));
            optimisticEvents.push(nodeUnfocused(nodeIdToUnfocus));
            optimisticEvents.push(nodeFocused(newNodeId));
        }

        dispatch(nodeTransaction(optimisticEvents));
        dbRepository.createNode(newNode, appState.app.currentUserPageId, updatedParentChildIds);
    };
}

function nodeTransaction(events){
    return {
        type: NODE_TRANSACTION,
        payload: events
    };
}

export function updateContent(nodeId, newContent) {
    return (dispatch, getState) => {
        const appState = getState();
        dbRepository.updateNodeContent(nodeId, newContent, appState.auth.id);
        dispatch(contentUpdated(nodeId, newContent));
    };
}

export function focusNode(nodeId){
    return (dispatch, getState) => {
        const appState = getState();
        let nodes = getPresentNodes(appState);
        let nodeIdsToDeselect = getCurrentlySelectedNodeIds(nodes);
        let nodeIdToUnfocus = getCurrentlyFocusedNodeId(nodes);
        let events = [];
        nodeIdsToDeselect.forEach(id => {
            events.push(nodeDeselected(id));
        });
        
        events.push(nodeUnfocused(nodeIdToUnfocus));
        events.push(nodeFocused(nodeId));
        dispatch(nodeTransaction(events));

        dbRepository.updateNodeSelectedByUser(nodeIdToUnfocus, null, null);
        dbRepository.updateNodeSelectedByUser(nodeId, appState.auth.id, appState.auth.displayName);
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
        const appState = getState();
        const rootNodeId = getRootNodeId(appState);
        var siblingAbove = getNextNodeThatIsVisible(rootNodeId, getPresentNodes(appState), nodeId, true);
        var addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1];
        dispatch(nodeTransaction(generateEventsForReassignParentNode(nodeId, parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId, appState)));
        dispatch(nodeFocused(nodeId));
    };
}

export function promoteNode(nodeId, parentId){
    return (dispatch, getState) => {
        const appState = getState();
        const nodes = getPresentNodes(appState);
        let parentNode = nodes[parentId];
        let optimisticEvents = [];
        // reassign all siblings below to the promoted node
        var siblingIds = parentNode.childIds;
        for(let i = siblingIds.indexOf(nodeId) + 1; i < siblingIds.length; i++){
            let sibling = nodes[siblingIds[i]];
            optimisticEvents.push(generateEventsForReassignParentNode(sibling.id, sibling.parentId, nodeId, appState));
        }
        optimisticEvents = [ ...optimisticEvents, ...generateEventsForReassignParentNode(nodeId, parentId, parentNode.parentId, parentId, appState)];
        dispatch(nodeTransaction(optimisticEvents));
        dispatch(nodeFocused(nodeId));
    };
}

// attaches a node to a new parent node and optimistically updates local app store
function generateEventsForReassignParentNode(nodeId, oldParentId, newParentId, addAfterSiblingId, appState){
    let optimisticEvents = [];
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

    dbRepository.reassignParentNode(nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, appState.auth.id);

    return optimisticEvents;
}

export function deleteNode(nodeId, parentId) {
    return (dispatch, getState) => {
        let nodes = getPresentNodes(getState());
        if(Object.keys(nodes).length > 2){
            const appState = getState();
            let nodeToDelete = nodes[nodeId];
            let updatedParentChildIds = nodes[nodeToDelete.parentId].childIds.filter(id => id !== nodeId);
            let descendantIdsOfNode = getAllDescendantIds(nodes, nodeId);
            dispatch(childIdsUpdated(nodeToDelete.parentId, updatedParentChildIds));
            dispatch(nodesDeleted([nodeId]));

            dbRepository.deleteNode(nodeToDelete, updatedParentChildIds, descendantIdsOfNode, appState.auth.id);
        }
    };
}

export function toggleNodeExpansion(nodeId, forceToggleChildrenExpansion){
    return (dispatch, getState) => {
        const nodes = getPresentNodes(getState());
        var allDescendentIds = forceToggleChildrenExpansion ? getAllDescendantIds(nodes, nodeId) 
                                : getAllUncollapsedDescedantIds(nodeId, nodes, nodeId);
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
     return (dispatch, getState) => {
         const currentTreeState = getPresentNodes(getState());
         dispatch(ActionCreators.undo());
         const undoneTreeState = getPresentNodes(getState());
         let differences = treeDiffer(currentTreeState, undoneTreeState);

         // TODO: Sync FirebaseDb
     };
}

export function redo() {
     return (dispatch) => {
         const currentTreeState = getPresentNodes(getState());
         dispatch(ActionCreators.redo());
         const redoneTreeState = getPresentNodes(getState());
         let differences = treeDiffer(currentTreeState, redoneTreeState);
         
         // TODO: Sync FirebaseDb
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

/////////////
// Actions //
/////////////

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
        undoable: false,
        nodeId
    };
}

export function nodeUnfocused(nodeId){
    return {
        type: NODE_UNFOCUSED,
        undoable: false,
        nodeId
    };
}

export function nodeDeselected(nodeId){
    return {
        type: NODE_DESELECTED,
        undoable: false,
        nodeId
    };
}

export function nodeSelected(nodeId){
    return {
        type: NODE_SELECTED,
        undoable: false,
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

