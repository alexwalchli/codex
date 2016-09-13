import { firebaseDb } from '../firebase';
import * as nodeActions from './node';
import { navigateToUserPage } from './app';
import nodeFactory from '../utilities/node-factory';
import userPageFactory from '../utilities/user-page-factory';
import { dictionaryToArray, getAllDescendantIds, getPresentNodes } from '../utilities/tree-queries';
import * as dbRepository from '../repositories/database-repository';

///////////////////
// Action Creators 
///////////////////

export function createNewUserPage(title){
    return (dispatch, getState) => {
        // create new root node
        let createNewPageUpdates = {},
            appState = getState(),
            rootNodeId = firebaseDb.ref('nodes').push().key,
            firstNodeId = firebaseDb.ref('nodes').push().key,
            newUserPageId = firebaseDb.ref('userPages').push().key;

        let newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', appState.auth.id);
        let newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], 'Your first node', appState.auth.id);
        let newUserPage = userPageFactory(newUserPageId, rootNodeId, appState.auth.id);

        dbRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
            .then(snapshot => {
                dispatch(navigateToUserPage(newUserPageId));
            });
    };
}

export function subscribeToUserPages(){
    return (dispatch, getState) => {
        let appState = getState();
        firebaseDb.ref('userPages/' + appState.auth.id).once('value').then(snapshot => {
            var userPages = dictionaryToArray(snapshot.val());
            if(!userPages || userPages.length === 0){
                dispatch(initializeUserHomePage());
            } else {
                userPages.forEach(userPage => {
                    dispatch(userPageCreated(userPage));
                });
                
                dispatch(navigateToUserPage(userPages.find(u => u.isHome).id));
            }

            firebaseDb.ref('userPages/' + appState.auth.id).on('child_added', snapshot => {
                dispatch(userPageCreated(snapshot.val()));
            });

        });
    };
}

export function initializeUserHomePage(){
    return (dispatch, getState) => {
        let initialAppStateUpdates = {},
            appState = getState(),
            rootNodeId = firebaseDb.ref('nodes').push().key,
            firstNodeId = firebaseDb.ref('nodes').push().key,
            homeUserPageId = firebaseDb.ref('userPages').push().key;

        let newRootNode = nodeFactory(rootNodeId, null, [firstNodeId], '', appState.auth.id);
        let newFirstNode = nodeFactory(firstNodeId, rootNodeId, [], 'Your first node', appState.auth.id);
        let newUserPage = userPageFactory(homeUserPageId, rootNodeId, appState.auth.id, 'Home', true);

        dbRepository.createUserPage(newUserPage, newRootNode, newFirstNode)
            .then(snapshot => {
                dispatch(navigateToUserPage(homeUserPageId));
            }); 
    };
}

export function deleteUserPage(userPageId){
    return (dispatch, getState) => {
        if(confirm('Are you sure?')){
            const appState = getState();
            let userPage = appState.userPages[userPageId],
                rootNode = appState.nodes[userPage.rootNodeId],
                auth = appState.auth;

            dbRepository.deleteUserPage(userPage, rootNode, auth);
            dispatch(navigateToUserPage(dictionaryToArray(appState.userPages).find(u => u.isHome).id));
            dispatch(userPageDeleted(userPageId));
        }
    };
}

export function updateUserPageName(userPageId, newUserPageName){
    return (dispatch, getState) => {
        const appState = getState();
        dbRepository.updateUserPageName(appState.userPages[userPageId], newUserPageName);
        dispatch(userPageNameUpdated(userPageId, newUserPageName));
    };
}

export function shareUserPage(userPageId, emails){
    if(!emails){
        return;
    }
    
    return (dispatch, getState) => {
        const appState = getState();
        let emailsArr = emails.split(',');
        let userPage = appState.userPages[userPageId];
        let allDescendantIds = getAllDescendantIds(getPresentNodes(appState), userPage.rootNodeId);
        dbRepository.shareUserPage(userPage, allDescendantIds, emailsArr, appState.auth);
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