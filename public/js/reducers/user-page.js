import { SUBSCRIBE_TO_USER_PAGES, USER_PAGE_CREATED } from '../actions/user-pages';

export function userPages(state = {}, action){
    var newState = Object.assign({}, state);

    switch (action.type) {
    case USER_PAGE_CREATED:
        newState[action.payload.id] = Object.assign({}, action.payload);
        return newState;
    default:
      return newState;
    }
}