import { firebaseAuth, firebaseDb } from '../firebase';
import * as firebaseActions from './firebase-actions';
import * as authActions from './auth';
import * as userPageActions from './user-pages';
import * as appActions from './app';
import * as nodeActions from './node';
import { dictionaryToArray, getPresentNodes } from '../utilities/tree-queries';

let initialized = false;
export const INITIAL_NODE_STATE_LOADED = 'INITIAL_NODE_STATE_LOADED';

export function subscribeToAuthStateChanged(dispatch) {
    return new Promise((resolve, reject) => {
        firebaseAuth.onAuthStateChanged(
            user => {
                dispatch(authActions.updateAuthState(user));
                if(user){
                    firebaseActions.createEmailUser(user.email, user.uid);
                    dispatch(subscribeToUserPages());
                }
            },
            error => reject(error)
        );
    });
}

export function subscribeToUserPages(){
    return (dispatch, getState) => {
        let appState = getState();
        firebaseDb.ref('userPages/' + appState.auth.id).once('value').then(snapshot => {
            var userPages = dictionaryToArray(snapshot.val());
            if(!userPages || userPages.length === 0){
                dispatch(userPageActions.initializeUserHomePage());
            } else {
                userPages.forEach(userPage => {
                    dispatch(userPageActions.userPageCreated(userPage));
                });
                
                dispatch(appActions.navigateToUserPage(userPages.find(u => u.isHome).id));
            }

            firebaseDb.ref('userPages/' + appState.auth.id).on('child_added', snapshot => {
                dispatch(userPageActions.userPageCreated(snapshot.val()));
            });

        });
    };
}

export function subscribeToNodes(){
    return (dispatch, getState) => {
        // do an initial load of the user's nodes based on the current user page's descendantIds
        // and then subscribe to changes on each node
        let appState = getState(),
            currentUserPage =  appState.userPages[appState.app.currentUserPageId],
            initialNodeState = {},
            initialNodePromises = [];

        // collection of all node Ids for this userPage and user
        let userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id);
        userPageUserNodesRef.once('value').then(userPageUsersNodesSnapshot => {
            let nodeIds = Object.keys(userPageUsersNodesSnapshot.val());

            dispatch(subscribeToUserPageUserNodes(appState.app.currentUserPageId));

            // retrieve all nodes and then subscribe to each
            nodeIds.forEach(descendantId => {
                let nodeRef = firebaseDb.ref('nodes/' + descendantId),
                nodePromise = new Promise((resolve, reject) => {
                    nodeRef.once('value').then(snapshot => {
                        let node = unwrapNodeSnapshot(snapshot);

                        initialNodeState[descendantId] = node;
                        dispatch(subscribeToNode(node.id));

                        resolve();
                    });
                });
                initialNodePromises.push(nodePromise);
            });

            Promise.all(initialNodePromises).then(() => {
                dispatch({
                    type: INITIAL_NODE_STATE_LOADED,
                    payload: initialNodeState
                });

                initialized = true;
            });

        });
    };
}

export function subscribeToUserPageUserNodes(userPageId){
    return (dispatch, getState) => {
        const appState = getState();
        const userPageUserNodesRef = firebaseDb.ref('userPage_users_nodes/' + appState.app.currentUserPageId + '/' + appState.auth.id);

        userPageUserNodesRef.on('child_added', snapshot => {
            let nodeId = snapshot.key,
                nodeDoesNotExistsInAppState = !getPresentNodes(getState())[nodeId];
            if(initialized && nodeDoesNotExistsInAppState){
                firebaseActions.getNodeSnapshot(nodeId).then(node => {
                    dispatch(subscribeToNode(nodeId));
                    dispatch(nodeActions.nodeCreated(node));
                });
            }
        });

        userPageUserNodesRef.on('child_removed', snapshot => {
            let nodeId = snapshot.key,
                nodeDoesNotExistsInAppState = !getPresentNodes(getState())[nodeId];
            if(initialized && nodeDoesNotExistsInAppState){
                dispatch(nodeActions.nodesDeleted([nodeId]));
            }
        });
    };
}

export function subscribeToNode(nodeId){
    return (dispatch, getState) => {
        const nodeRef = firebaseDb.ref('nodes/' + nodeId),
              nodeChildIdsRef = firebaseDb.ref('nodes/' + nodeId + '/childIds');

        nodeRef.on('value', snapshot => {
            const appState = getState(),
            nodes = getPresentNodes(appState),
            updatedNode = unwrapNodeSnapshot(snapshot);

            if(initialized && updatedNode){
                let nodeWasJustCreatedButNotByCurrentUser = updatedNode.lastUpdatedById === undefined && updatedNode.createdById !== appState.auth.id;
                let nodeWasNotUpdatedByCurrentUser = updatedNode.lastUpdatedById !== appState.auth.id;
                
                if(nodeWasJustCreatedButNotByCurrentUser && nodeWasNotUpdatedByCurrentUser){
                    dispatch(nodeActions.nodeUpdated(updatedNode));
                }
            }

        });

        nodeChildIdsRef.on('child_added', snapshot => {
        
        });

        nodeChildIdsRef.on('child_removed', snapshot => {

            let nodeExistsInAppState = getPresentNodes(getState())[snapshot.key];
            if(initialized && nodeExistsInAppState){
                dispatch(nodeActions.nodesDeleted([snapshot.key]));
            }   

        });
    };
}

function onNodeAdded(snapshot){

}

// when a $userPageId/$userId/$nodeId is added, a node was either added by another user or access was given
function onUserPageUserNodeAdded(snapshot){

}

// when a $userPageId/$userId/$nodeId is removed, the node was either deleted or access was revoked
function onUserPageUserNodeRemoved(snapshot){

}

function unwrapNodeSnapshot(nodeSnapshot){
    let node = nodeSnapshot.val();
    node.childIds = node.childIds || [];
    return node;
}

