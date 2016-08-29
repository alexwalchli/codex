
///////////////////
// Action Creators 
///////////////////
export function togglePagesSidePanel(){
    return (dispatch, getState) => {
        dispatch(sidePanelToggled());
    };
}

///////////////////
// Actions 
///////////////////
export const SIDE_PANEL_TOGGLED = 'SIDE_PANEL_TOGGLED';
export const NAVIGATE_TO_USER_PAGE = 'NAVIGATE_TO_USER_PAGE';

export function sidePanelToggled(){
    return {
        type: SIDE_PANEL_TOGGLED
    };
}

export function navigateToUserPage(userPageId){
    return {
        type: NAVIGATE_TO_USER_PAGE,
        payload: {
            userPageId
        }
    };
}

