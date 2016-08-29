import { SIDE_PANEL_TOGGLED, NAVIGATE_TO_USER_PAGE } 
    from '../actions/app';

export function app(state = {}, action){
    switch(action.type){
        case SIDE_PANEL_TOGGLED:
            return Object.assign({}, state, {
                pagesSidePanelVisible: !state.pagesSidePanelVisible
            });
        case NAVIGATE_TO_USER_PAGE:
            return Object.assign({}, state, {
                currentUserPageId: action.payload.userPageId
            });
        default:
            return Object.assign({}, state);
    }
}