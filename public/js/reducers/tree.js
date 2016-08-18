import { NODE_CREATED, NODE_FOCUSED, INITIAL_NODE_STATE_LOADED, NODE_SHOWN, NODE_HIDDEN, NODE_EXPANDED, NODE_COLLAPSED,
         CONTENT_UPDATED, CHILD_IDS_UPDATED, NODE_UNFOCUSED, NODES_DELETED, PARENT_UPDATED, NODE_SELECTED, NODE_DESELECTED,
         NODE_EXPANSION_TOGGLED, NODE_TRANSACTION, NODE_PARENT_UPDATED, NODE_UPDATED, NODES_SEARCHED } 
    from '../actions/node';
import { dictionaryToArray } from '../utilities/state-queries';

function childIds(state, action) {
    return Object.assign([], action.payload.newChildIds);
}

function node(state, action) {
    switch (action.type) {
    case NODE_CREATED:
        return newNode(action.payload);
    case NODE_UPDATED:
        return Object.assign({}, action.payload);
    case NODE_FOCUSED:
        return Object.assign({}, state, {
            focused: true
        });
    case NODE_UNFOCUSED:
        return Object.assign({}, state, {
            focused: false
        });
    case NODE_SELECTED:
        return Object.assign({}, state, {
            selected: true
        });
    case NODE_DESELECTED:
        return Object.assign({}, state, {
            selected: false
        });
    case CONTENT_UPDATED:
        return Object.assign({}, state, {
            content: action.payload.content,
            lastUpdatedById: action.payload.updatedById
        });
    case CHILD_IDS_UPDATED:
        return Object.assign({}, state, {
            childIds: childIds(state.childIds, action),
            lastUpdatedById: action.payload.updatedById
        });
    case NODE_PARENT_UPDATED:
        return Object.assign({}, state, {
            parentId: action.payload.newParentId,
            lastUpdatedById: action.payload.updatedById
        });
    case NODE_SHOWN:
        return Object.assign({}, state, {
            visible: true
        });
    case NODE_HIDDEN:
        return Object.assign({}, state, {
            visible: false
        });
    case NODE_COLLAPSED:
        return Object.assign({}, state, {
            collapsed: true
        });
    case NODE_EXPANDED:
        return Object.assign({}, state, {
            collapsed: false
        });
    default:
      return state;
  }
}

export function tree(state = {}, action) {
    var newState = Object.assign({}, state);

    if(action.type === NODE_TRANSACTION){
        action.payload.forEach(a => {
            newState = handleAction(newState, a);
        });
        return newState;
    }

    if(action.type === NODES_SEARCHED){
        dictionaryToArray(newState).forEach((n) =>{
            if(action.payload.resultingNodeIds.indexOf(n.id) === -1){
                newState[n.id] = node(n, { type: NODE_HIDDEN });
            } else {
                newState[n.id] =  node(n, { type: NODE_SHOWN });
            }
        });

        return newState;
    }

    return handleAction(newState, action);
}

function handleAction(newState, action){
    const { nodeId } = action;

    if(nodeId){
        newState[nodeId] = node(newState[nodeId], action);
    }
    
    if(action.type === INITIAL_NODE_STATE_LOADED) {
        return Object.assign({}, action.payload);
    } 

    if(action.type === NODES_DELETED){
        action.payload.forEach(nodeId => {
            delete newState[nodeId];
        });
    }

    if(action.type === NODE_COLLAPSED || action.type === NODE_EXPANDED){
        let nodeAction = action.type === NODE_COLLAPSED ? NODE_HIDDEN : NODE_SHOWN;
        action.payload.forEach(descendentId => {
            newState[descendentId] = node(newState[descendentId], { type: nodeAction, descendentId });
        });
    }

    return newState;
}

function newNode(node){
    var newNode = Object.assign({}, node);
    newNode.childIds = node.childIds || [];
    newNode.widgets = node.widgets || [];

    return newNode;
}
