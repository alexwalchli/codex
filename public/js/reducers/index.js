import { combineReducers } from 'redux';
import { externalDataCache, selectedDataSource } from './external-data-cache';
import { search } from './search';
import { tree } from './tree';
import undoable, { excludeAction } from 'redux-undo';
import {  FOCUS_NODE, FOCUS_NODE_ABOVE, FOCUS_NODE_BELOW, UNFOCUS_NODE, SEARCH_NODES, SHOW_SEARCH_RESULTS, 
  UPDATE_WIDGET_DATA_IF_NECESSARY, SELECT_NODE, DESELECT_NODE, NODE_WIDGETS_UPDATING, NODE_WIDGETS_UPDATED, REMOVE_CHILD, ADD_CHILD } 
  from '../actions';

const undoableTree = undoable(tree, {
  filter: excludeAction([FOCUS_NODE,
                         FOCUS_NODE_ABOVE,
                         FOCUS_NODE_BELOW,
                         UNFOCUS_NODE,
                         SEARCH_NODES,
                         SHOW_SEARCH_RESULTS,
                         UPDATE_WIDGET_DATA_IF_NECESSARY,
                         NODE_WIDGETS_UPDATING,
                         NODE_WIDGETS_UPDATED,
                         SELECT_NODE,
                         DESELECT_NODE,
                         REMOVE_CHILD,
                         ADD_CHILD])
});
const rootReducer = combineReducers({
  externalDataCache,
  selectedDataSource,
  tree: undoableTree,
  search
});

export default rootReducer;