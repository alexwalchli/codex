import { combineReducers } from 'redux';
import { externalDataCache, selectedDataSource } from './external-data-cache';
import { search } from './search';
import { tree } from './tree';

const rootReducer = combineReducers({
  externalDataCache,
  selectedDataSource,
  tree,
  search
});

export default rootReducer;