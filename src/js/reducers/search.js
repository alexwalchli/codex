import {
  SEARCH_NODES
} from '../actions';

export function search(state = { }, action) {
  switch (action.type) {
    case SEARCH_NODES:
        return Object.assign({}, state, {
            query: action.query
        });
    default:
      return state;
  }
}