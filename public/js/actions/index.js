import fetch from 'isomorphic-fetch';
import Endpoints from '../endpoints';
import urlWidget from '../widgets/url-widget';
import stockTickerWidget from '../widgets/stock-ticker-widget';
import { ActionCreators } from 'redux-undo';

//
// TREE ACTIONS
//

export const CREATE_NODE = 'CREATE_NODE'; // create a node
export const FOCUS_NODE = 'FOCUS_NODE'; // set focused the node
export const FOCUS_NODE_ABOVE = 'FOCUS_NODE_ABOVE'; // set focused prop of the node above
export const FOCUS_NODE_BELOW = 'FOCUS_NODE_BELOW'; // set focused prop of the node below
export const UNFOCUS_NODE = 'UNFOCUS_NODE'; // set focused prop to false
export const DELETE_NODE = 'DELETE_NODE'; // delete a node
export const ADD_CHILD = 'ADD_CHILD'; // add a child to a new parent
export const HIDE_NODE = 'HIDE_NODE'; // hides a node from view
export const SHOW_NODE = 'SHOW_NODE'; // displays a node
export const REMOVE_CHILD = 'REMOVE_CHILD'; // remove, but not delete, a child
export const DEMOTE_NODE = 'DEMOTE_NODE'; // 'indent' a bullet
export const PROMOTE_NODE = 'PROMOTE_NODE'; // 'outdent' a bullet
export const UPDATE_PARENT = 'UPDATE_PARENT'; // change the parent ID of a node
export const NODE_RECEIVED_DATA = "NODE_RECEIVED_DATA"; // node received data from a API response
export const UPDATE_CONTENT = "UPDATE_CONTENT"; // user entered new content into the Node
export const TOGGLE_NODE_EXPANSION = "TOGGLE_NODE_EXPANSION"; // show/hides a node's children
export const SEARCH_NODES = "SEARCH_NODES"; // fires a search/filter on nodes, stores query in state
export const SHOW_SEARCH_RESULTS = "SHOW_SEARCH_RESULTS"; // shows the result of a search and hides all other nodes
export const UPDATE_WIDGET_DATA_IF_NECESSARY = "UPDATE_WIDGET_DATA_IF_NECESSARY"; // updates a node's widget data
export const NODE_WIDGETS_UPDATED = "NODE_WIDGETS_UPDATED"; // signifies a node that has had its widget data updated
export const NODE_WIDGETS_UPDATING = "NODE_WIDGETS_UPDATING"; // signifies a node that is having its widget data updated
export const SELECT_NODE = "SELECT_NODE"; // for multi-selecting nodes
export const DESELECT_NODE = "DESELECT_NODE"; // for deselecting multi-selected nodes
export const DELETE_NODES = "DELETE_NODES"; // multi-deletion of nodes
export const UNDO = "UNDO"; // undos last action

export function createNode(fromSiblingId, fromSiblingOffset, parentId, content) {
    return {
        type: CREATE_NODE,
        nodeId: generateUUID(),
        fromSiblingId,
        fromSiblingOffset,
        parentId,
        content,
        tags: [],
        dataSources: [],
        visible: true,
        widgets: []
    };
}

export function undo() {
     return (dispatch) => {
         dispatch(ActionCreators.undo());
     };
}

export function updateContent(nodeId, content) {
    return {
        type: UPDATE_CONTENT,
        nodeId,
        content
    };
}

export function focusNode(nodeId){
    return {
        type: FOCUS_NODE,
        nodeId
    };
}

export function selectNode(nodeId){
    return {
        type: SELECT_NODE,
        nodeId
    };
}

export function deselectNode(nodeId){
    return {
        type: DESELECT_NODE,
        nodeId
    };
}

export function focusNodeAbove(currentNodeId){
  return {
    type: FOCUS_NODE_ABOVE,
    nodeId : currentNodeId
  };
}

export function focusNodeBelow(currentNodeId){
  return {
    type: FOCUS_NODE_BELOW,
    nodeId : currentNodeId
  };
}

export function deleteNode(nodeId) {
  return {
    type: DELETE_NODE,
    nodeId
  };
}

export function deleteNodes(nodeIds) {
    return {
        type: DELETE_NODES,
        nodeIds
    };
}

export function toggleNodeExpansion(nodeId){
    return {
        type: TOGGLE_NODE_EXPANSION,
        nodeId
    };
}

export function addChild(nodeId, childId, fromSiblingId, fromSiblingOffset) {
  return {
    type: ADD_CHILD,
    nodeId,
    childId,
    fromSiblingId,
    fromSiblingOffset
  };
}

export function hideNode(nodeId){
    return {
        type: HIDE_NODE,
        nodeId
    };
}

export function showNode(nodeId){
    return {
        type: SHOW_NODE,
        nodeId
    };
}

export function demoteNode(nodeId, parentId){
  return {
    type: DEMOTE_NODE,
    nodeId,
    parentId
  };
}

export function promoteNode(nodeId, parentId){
  return {
    type: PROMOTE_NODE,
    nodeId,
    parentId
  };
}

export function removeChild(nodeId, childId) {
  return {
    type: REMOVE_CHILD,
    nodeId,
    childId
  };
}

export function nodeReceivedData(nodeId, dataSource){
  return {
    type: NODE_RECEIVED_DATA,
    nodeId,
    dataSource
  };
}

export function showSearchResults(nodeIds){
    return {
        type: SHOW_SEARCH_RESULTS,
        nodeIds
    };
}

export function updateNodeWidgetDataIfNecessary(nodeId, content){
    var morphedContent = content;

    return (dispatch, getState) => {
        var node = getState().tree.present.filter(n => n.id === nodeId)[0];
        
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

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

//
// EXTERNAL DATA ACTIONS
//

export const REQUEST_DATA = 'REQUEST_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const SELECT_DATASOURCE = 'SELECT_DATASOURCE';
export const INVALIDATE_DATASOURCE = 'INVALIDATE_DATASOURCE';

export function selectDataSource(dataSource) {
  return {
    type: SELECT_DATASOURCE,
    dataSource
  };
}

export function invalidateDataSource(dataSource) {
  return {
    type: INVALIDATE_DATASOURCE,
    dataSource
  };
}

function requestData(nodeId, dataSource) {
  return {
    type: REQUEST_DATA,
    dataSource,
    nodeId
  };
}

function receiveData(nodeId, dataSource, json) {
    return (dispatch, getState) => {
      // update the externalDataCache
      dispatch({
        type: RECEIVE_DATA,
        nodeId,
        dataSource,
        posts: Endpoints[dataSource].responseMapper(json),
        receivedAt: Date.now()
      });

      // let the node know it has new data
      dispatch(nodeReceivedData(nodeId, dataSource));
  };
}

function fetchData(nodeId, dataSource, dataSourceParameters) {
  return dispatch => {
    dispatch(requestData(nodeId, dataSource));
    var url = Endpoints[dataSource].url(dataSourceParameters);
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveData(nodeId, dataSource, json)));
  };
}

function shouldFetchData(state, nodeId, dataSource) {
  const node = state.tree.present.filter(node => node.id === nodeId)[0];
  if (!node.posts) {
    return true;
  } else if (node.isFetching) {
    return false;
  } else {
    return node.didInvalidate;
  }
}

export function fetchDataIfNeeded(nodeId, dataSource, dataSourceParameters) {
  var dataSourceInfo = dataSource.split('.');
  var source = dataSourceInfo[0];
  var parameter = dataSourceInfo[1];
  return (dispatch, getState) => {
    if (shouldFetchData(getState(), nodeId, dataSource)) {
      return dispatch(fetchData(nodeId, source, parameter));
    }
  };
}

export function searchNodes(query){
    return (dispatch, getState) => {
        
        var nodes = getState().tree.present;
        var resultingNodeIds = nodes.filter(node => {
            if(node.id === "0") {
                return true;
            } else if(!query){
                return true;
            } else if(!node.content){
                return false;
            }

            return node.content.includes(query);
        }).map(node => { return node.id; });

        dispatch(showSearchResults(resultingNodeIds));
        dispatch({
            type: SEARCH_NODES,
            resultingNodeIds: [],
            query: query
        });
    };
}
