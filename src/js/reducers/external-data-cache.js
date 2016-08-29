import {
  SELECT_DATASOURCE, INVALIDATE_DATASOURCE,
  REQUEST_DATA, RECEIVE_DATA
} from '../actions';

export function selectedDataSource(state = 'reactjs', action) {
  switch (action.type) {
  case SELECT_DATASOURCE:
    return action.dataSource;
  default:
    return state;
  }
}

function data(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_DATASOURCE:
      return Object.assign({}, state, {
        didInvalidate: true
      });
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      });
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        nodeId: action.nodeId,
        isFetching: false,
        didInvalidate: false,
        items: action.posts, // TODO: could be anything
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

export function externalDataCache(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_DATASOURCE:
    case RECEIVE_DATA:
    case REQUEST_DATA:
      return Object.assign({}, state, {
        // TODO: dataSource per node?
        [action.dataSource]: data(state[action.dataSource], action)
      });
    default:
      return state;
  }
}