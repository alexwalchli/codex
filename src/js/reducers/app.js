import { SIDE_PANEL_TOGGLED, NAVIGATED_TO_USER_PAGE, OPEN_SHARE_USER_PAGE_DIALOG, CLOSE_SHARE_USER_PAGE_DIALOG } 
    from '../actions/app';

export function app(state = {}, action){
    switch(action.type){
        case SIDE_PANEL_TOGGLED:
            return Object.assign({}, state, {
                pagesSidePanelVisible: !state.pagesSidePanelVisible
            });
        case NAVIGATED_TO_USER_PAGE:
            return Object.assign({}, state, {
                currentUserPageId: action.payload.userPageId
            });
        case OPEN_SHARE_USER_PAGE_DIALOG:
            return Object.assign({}, state, {
                showShareUserPageDialog: action.payload.userPageId
            });
        case CLOSE_SHARE_USER_PAGE_DIALOG:
            return Object.assign({}, state, {
                showShareUserPageDialog: null
            });
        default:
            return Object.assign({}, state);
    }
}