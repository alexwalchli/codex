
// TODO: Should no longer be dependent on the index of nodes in the array. Index will be stored in a seperate collection.
// TODO: This all needs some serious clean-up at some point
// TODO: Store index of node on nodes to remove use of nodeIndexById everywhere
// TODO: Child actions should get created by original action, move all logic out
// TODO: Optimize focusing/unfocusing all and select node handling

import {    NODE_CREATED, INCREMENT, ADD_CHILD, REMOVE_CHILD, CREATE_NODE, FOCUS_NODE, HIDE_NODE, SHOW_NODE,
            FOCUS_NODE_ABOVE, FOCUS_NODE_BELOW, UNFOCUS_NODE, DELETE_NODE,
            INCREMENT_INDEX, DEMOTE_NODE, PROMOTE_NODE, UPDATE_PARENT, NODE_RECEIVED_DATA,
            UPDATE_CONTENT, TOGGLE_NODE_EXPANSION, SHOW_SEARCH_RESULTS, SELECT_NODE, DESELECT_NODE, DELETE_NODES,
            NODE_WIDGETS_UPDATED, NODE_WIDGETS_UPDATING  } 
from '../actions/node';

function childIds(state, action) {
    switch (action.type) {
    case ADD_CHILD:
        if(action.fromSiblingId){
            var newState = [...state];
            newState.splice(state.indexOf(action.fromSiblingId) + action.fromSiblingOffset, 0,  action.childId);
            return newState;
        }

        return [action.childId, ...state];
    case REMOVE_CHILD:
        return state.filter(id => id !== action.childId);
    default:
        return state;
    }
}

function nodeIds(state){
    var rootId = [ state[0].id ];
    var childrenOfRoot = state[0].childIds.reduce((acc, childId, idx) => (
        [ ...acc, childId, ...getAllDescendantIds(state, childId) ]
    ), []);

    return [ rootId, ...childrenOfRoot ];
}

function nodeReducer(state, action) {
    switch (action.type) {
    case CREATE_NODE:
        return {
            id: action.nodeId,
            parentId: action.parentId,
            childIds: [],
            dataSources: [],
            collapsed: false,
            visible: true, 
            content: action.content,
            widgets: []
        };
    case NODE_RECEIVED_DATA:
        return Object.assign({}, state, {
            dataSources: [...state.dataSources, action.dataSource]
        });
    case HIDE_NODE:
        return Object.assign({}, state, {
            visible: false
        }); 
    case SHOW_NODE:
        return Object.assign({}, state, {
            visible: true
        }); 
    case FOCUS_NODE:
        return Object.assign({}, state, {
            focused: true
        });
    case UNFOCUS_NODE:
        return Object.assign({}, state, {
            focused: false
        });
    case UPDATE_PARENT:
        return Object.assign({}, state, {
            parentId: action.parentId
        });
    case UPDATE_CONTENT:
        return Object.assign({}, state, {
            content: action.content
        });
    case TOGGLE_NODE_EXPANSION:
        return Object.assign({}, state, {
            collapsed: !state.collapsed
        });
    case SELECT_NODE:
        return Object.assign({}, state, {
            selected: true
        });
    case DESELECT_NODE:
        return Object.assign({}, state, {
            selected: false
        });
    case NODE_WIDGETS_UPDATED:
        return Object.assign({}, state, {
            widgets: action.widgets,
            widgetDataUpdating: false
        });
    case NODE_WIDGETS_UPDATING:
        return Object.assign({}, state, {
            widgetDataUpdating: true
        });
    case ADD_CHILD:
    case REMOVE_CHILD:
      return Object.assign({}, state, {
        childIds: childIds(state.childIds, action)
      });
    default:
      return state;
  }
}

function getSiblingNodeAbove(state, nodeId, parentId){
    var parentNode = state[nodeIndexById(state, parentId)];
    var siblingNodeAboveId = parentNode.childIds[parentNode.childIds.indexOf(nodeId) - 1];

    return state[nodeIndexById(state, siblingNodeAboveId)];
}

function reassignParentNode(state, nodeId, oldParentId, newParentId, addAfterSiblingId){
    var nodeIndex = nodeIndexById(state, nodeId);
    var oldParentIndex = nodeIndexById(state, oldParentId);
    var newParentIndex = nodeIndexById(state, newParentId);
    state[oldParentIndex] = nodeReducer(state[oldParentIndex], { type: REMOVE_CHILD, childId: nodeId});
    state[nodeIndex] = nodeReducer(state[nodeIndex], { type: UPDATE_PARENT, parentId: newParentId });
    state[newParentIndex] = nodeReducer(state[newParentIndex], { type: ADD_CHILD, childId: nodeId, fromSiblingId: addAfterSiblingId, fromSiblingOffset: 1 });

    return state;
}

function nodeIndexById(state, nodeId){
    return nodeIds(state).indexOf(nodeId);
}

function indexOfLastChildOrParentById(treeState, parentNodeId){
    var parentIndex = nodeIndexById(treeState, parentNodeId);
    var parentNode = treeState[parentIndex];
    if(parentNode.childIds.length){
        return nodeIndexById(treeState, parentNode.childIds[parentNode.childIds.length - 1]);
    }

    return parentIndex;
}

function getAllDescendantIds(state, nodeId) {
  return nodeById(state, nodeId).childIds.reduce((acc, childId) => (
    [ ...acc, childId, ...getAllDescendantIds(state, childId) ]
  ), []);
}

function nodeById(state, nodeId){
    return state.find(n => n.id === nodeId);
}

function getNextNodeIndexThatIsVisible(treeState, nodeIndex, searchAbove = true){
    var bound = searchAbove ? 0 : treeState.length;

    if(searchAbove){
        for(let j = nodeIndex - 1; j > 0; j--){
            if(treeState[j].visible){
                return j;
            }
        }
    } else {
        for(let k = nodeIndex + 1; k < treeState.length; k++){
            if(treeState[k].visible){
                return k;
            }
        }
    }

    return null;
}

function deleteMany(state, ids) {
    state = Object.assign([], state);
    ids.forEach(id => state.splice(nodeIndexById(state, id), 1));
    return state;
}

export function tree(state = [], action) {
    const { nodeId } = action;
    var newState = Object.assign([], state);

    if(action.type === NODE_CREATED){
        
    }

    if(action.type === SHOW_SEARCH_RESULTS){
        newState = newState.map((node) =>{
            if(action.nodeIds.indexOf(node.id) === -1){
                return nodeReducer(node, { nodeId: node.id, type: HIDE_NODE });
            }else{
                return nodeReducer(node, { nodeId: node.id, type: SHOW_NODE });
            }
        });

        return newState;
    }

    if(action.type === DELETE_NODES){
        action.nodeIds.forEach(nodeId => {
            var node = newState[nodeIndexById(newState, nodeId)];
            if(node){
                var parentIndex = nodeIndexById(newState, node.parentId);
                newState[parentIndex] = nodeReducer(newState[parentIndex], { type: REMOVE_CHILD, nodeId: node.parentId, childId : nodeId });
                newState = handleDeleteNode(newState, { nodeId: nodeId, type: DELETE_NODE });
            }
        });

        return newState;
    }

    if (typeof nodeId === 'undefined') {
        return state;
    }

    if (action.type === DELETE_NODE) {
        return handleDeleteNode(newState, action);
    }

    if(action.type === FOCUS_NODE || action.type === FOCUS_NODE_ABOVE || action.type === FOCUS_NODE_BELOW){
        var nodeIndex = nodeIndexById(newState, action.nodeId);
        if((nodeIndex === 1 && action.type === FOCUS_NODE_ABOVE) || (nodeIndex === newState.length - 1 && action.type === FOCUS_NODE_BELOW)){
            return newState;
        }

        // unfocus all and deselect all
        newState = newState.map((node) =>{
            return nodeReducer(node, { type: UNFOCUS_NODE });
        });
        newState = newState.map((node) =>{
            return nodeReducer(node, { type: DESELECT_NODE });
        });
    }

    if(action.type === SELECT_NODE){
        newState = newState.map((node) =>{
            return nodeReducer(node, { type: UNFOCUS_NODE });
        });
    }
  
    if(action.type === FOCUS_NODE_ABOVE || action.type === FOCUS_NODE_BELOW){
        // update focus on node above or below the current nodeId that is visible
        var nodeIndexToFocus = getNextNodeIndexThatIsVisible(newState, nodeIndexById(newState, action.nodeId), action.type === FOCUS_NODE_ABOVE);
        var nodeToFocus = newState[nodeIndexToFocus];
        newState[nodeIndexToFocus] = nodeReducer(nodeToFocus, { type: FOCUS_NODE });
    }

    if(action.type === CREATE_NODE){
        newState.splice(indexOfLastChildOrParentById(newState, action.fromSiblingId) + action.fromSiblingOffset, 0,  nodeReducer(newState, action));
        return newState;
    }

    if(action.type === DEMOTE_NODE){
        return handleDemoteNode(newState, action);
    }

    if(action.type === PROMOTE_NODE){
        return handlePromoteNode(newState, action);
    }

    if(action.type === TOGGLE_NODE_EXPANSION){
        // set all descendants to hidden or visible
        var node = newState[nodeIndexById(newState, action.nodeId)];
        var allDescendentIds = getAllDescendantIds(newState, node.id);
        var hideOrShowDescendents = node.collapsed ? SHOW_NODE : HIDE_NODE;
        allDescendentIds.forEach(id => {
                newState[nodeIndexById(newState, id)] = nodeReducer(newState[nodeIndexById(newState, id)], { nodeId: id, type: hideOrShowDescendents });
        });
    }

    newState = newState.map((node) =>{
        if(node.id === action.nodeId){
            node = nodeReducer(node, action);
        }
        return node;
    });

    return newState;
}

function handleDeleteNode(treeState, action){
    const descendantIds = getAllDescendantIds(treeState, action.nodeId);
    return deleteMany(treeState, [ action.nodeId, ...descendantIds ]);
}

function handleDemoteNode(newState, action){
    var demotedNodeIndex = nodeIndexById(newState, action.nodeId);
    var demotedNode = newState[demotedNodeIndex];
    var siblingAbove = getSiblingNodeAbove(newState, action.nodeId, action.parentId);
    var addAfterLastChildOfSiblingAboveId = siblingAbove.childIds[siblingAbove.childIds.length - 1];

    reassignParentNode(newState, action.nodeId, action.parentId, siblingAbove.id, addAfterLastChildOfSiblingAboveId);

    return newState;
}

function handlePromoteNode(newState, action){
    var promotedNodeIndex = nodeIndexById(newState, action.nodeId);
    var parentIndex = nodeIndexById(newState, action.parentId);
    var parentsParentId = newState[parentIndex].parentId;
    var parentsParentIndex = nodeIndexById(newState, parentsParentId);

    // reassign all siblings below to the promoted node
    var siblingIds = newState[parentIndex].childIds;
    for(let i = siblingIds.indexOf(action.nodeId) + 1; i < siblingIds.length; i++){
        var sibling = newState[nodeIndexById(newState, siblingIds[i])];
        reassignParentNode(newState, sibling.id, sibling.parentId, action.nodeId);
    }

    reassignParentNode(newState, action.nodeId, action.parentId, newState[parentsParentIndex].id, action.parentId);

    return newState;
}
