import { firebaseDb } from '../firebase';
import * as nodeActions from './node';
import { navigateToUserPage } from './app';
import nodeFactory from '../utilities/node-factory';
import { dictionaryToArray } from '../utilities/tree-queries';

///////////////////
// Action Creators 
///////////////////

export function createNewUserPage(title){
    return (dispatch, getState) => {
        // create new root node
        let createNewPageUpdates = {};
        const state = getState();
        const rootNodeId = firebaseDb.ref('nodes').push().key;
        const firstNodeId = firebaseDb.ref('nodes').push().key;
        const newUserPageId = firebaseDb.ref('userPages').push().key;
        
        createNewPageUpdates['nodes/' + rootNodeId] = nodeFactory(rootNodeId, null, [firstNodeId], '', state.auth.id);
        createNewPageUpdates['nodes/' + firstNodeId] = nodeFactory(firstNodeId, rootNodeId, [], 'Your first node', state.auth.id);
        createNewPageUpdates['userPages/' + newUserPageId] = { id: newUserPageId, userId: state.auth.id, isHome: false, title: 'New Page', rootNodeId: rootNodeId };

        firebaseDb.ref().update(createNewPageUpdates)
            .then(snapshot => {
                dispatch(navigateToUserPage(newUserPageId));
            });
    };
}

export function subscribeToUserPages(){
    return (dispatch, getState) => {
        firebaseDb.ref('userPages').once('value').then(function(snapshot) {
            var userPages = snapshot.val();
            if(!userPages || userPages.length === 0){
                dispatch(initializeUserHomePage());
            } else {
                dispatch(nodeActions.subscribeToNodes());
                dispatch(navigateToUserPage(dictionaryToArray(userPages).find(u => u.isHome).id));
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
        initialAppStateUpdates['userPages/' + homeUserPageId] = { id: homeUserPageId, userId: state.auth.id, isHome: true, title: 'Home', rootNodeId: rootNodeId};

        firebaseDb.ref().update(initialAppStateUpdates)
            .then(snapshot => {
                dispatch(nodeActions.subscribeToNodes());
            });
    };
}

export function deleteUserPage(userPageId){
    return (dispatch, getState) => {
        if(confirm('Are you sure?')){
            firebaseDb.ref('userPages/' + userPageId).remove();
            dispatch(navigateToUserPage(dictionaryToArray(getState().userPages).find(u => u.isHome).id));
            dispatch(userPageDeleted(userPageId));
        }
    };
}

export function updateUserPageName(userPageId, newUserPageName){
    return (dispatch, getState) => {
        firebaseDb.ref('userPages/' + userPageId).update({ title: newUserPageName });
        dispatch(userPageNameUpdated(userPageId, newUserPageName));
    };
}

///////////////////
// Actions 
///////////////////
export const USER_PAGE_CREATED = 'USER_PAGE_CREATED';
export const USER_PAGE_DELETED = 'USER_PAGE_DELETED';
export const USER_PAGE_NAME_UPDATED = 'USER_PAGE_NAME_UPDATED';

export function userPageCreated(userPage){
    return {
        type: USER_PAGE_CREATED,
        payload: userPage
    };
}

export function userPageDeleted(userPageId){
    return {
        type: USER_PAGE_DELETED,
        payload: {
            userPageId
        }
    };
}

export function userPageNameUpdated(userPageId, newUserPageName){
    return {
        type: USER_PAGE_NAME_UPDATED,
        payload: {
            userPageId,
            newUserPageName
        }
    };
}