import { firebaseDb } from '../firebase';
import * as nodeActions from './node';
import nodeFactory from '../utilities/node-factory';

///////////////////
// Action Creators 
///////////////////

export function subscribeToUserPages(){
    return (dispatch, getState) => {
        firebaseDb.ref('userPages').once('value').then(function(snapshot) {
            var userPages = snapshot.val();
            if(!userPages || userPages.length === 0){
                dispatch(initializeUserHomePage());
            } else {
                dispatch(nodeActions.subscribeToNodes());
            }

            firebaseDb.ref('userPages').on('child_added', function(snapshot) {
                dispatch(userPageCreated(snapshot.val()));
            });
        });
    };
}

export function initializeUserHomePage(){
    return (dispatch, getState) => {
        var initialAppStateUpdates = {};
        const state = getState();
        const rootNodeId = firebaseDb.ref('nodes').push().key;
        const firstNodeId = firebaseDb.ref('nodes').push().key;
        const homeUserPageId = firebaseDb.ref('userPages').push().key;
        initialAppStateUpdates['nodes/' + rootNodeId] = nodeFactory(rootNodeId, null, [firstNodeId], '', state.auth.id);
        initialAppStateUpdates['nodes/' + firstNodeId] = nodeFactory(firstNodeId, rootNodeId, [], 'Your first node', state.auth.id);
        initialAppStateUpdates['userPages/' + homeUserPageId] = { id: homeUserPageId, isHome: true, title: 'Home', rootNodeId: rootNodeId};

        firebaseDb.ref().update(initialAppStateUpdates)
            .then(snapshot => {
                dispatch(nodeActions.subscribeToNodes());
            });
    };
}

///////////////////
// Actions 
///////////////////

export const USER_PAGE_CREATED = 'USER_PAGE_CREATED';

export function userPageCreated(userPage){
    return {
        type: USER_PAGE_CREATED,
        payload: userPage
    };
}