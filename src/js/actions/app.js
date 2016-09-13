import * as nodeActions from './node';

///////////////////
// Action Creators 
///////////////////

export function togglePagesSidePanel(){
    return (dispatch, getState) => {
        dispatch(sidePanelToggled());
    };
}

export function navigateToUserPage(userPageId){
    return (dispatch, getState) => {
        dispatch(navigatedToUserPage(userPageId));
        dispatch(nodeActions.subscribeToNodes());
    };
}

///////////////////
// Actions 
///////////////////

export const SIDE_PANEL_TOGGLED = 'SIDE_PANEL_TOGGLED';
export const NAVIGATED_TO_USER_PAGE = 'NAVIGATED_TO_USER_PAGE';

export function sidePanelToggled(){
    return {
        type: SIDE_PANEL_TOGGLED
    };
}

export function navigatedToUserPage(userPageId){
    return {
        type: NAVIGATED_TO_USER_PAGE,
        payload: {
            userPageId
        }
    };
}

