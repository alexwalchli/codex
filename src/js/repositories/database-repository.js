import { firebaseDb } from '../firebase';

export function createNode(node, userPageId, updatedParentChildIds){
    firebaseDb.ref('node_userPages_users/' + node.parentId).once('value').then(parentNodeUserPagesUsersSnapshot => {
        let parentNodeUserPagesUsers = parentNodeUserPagesUsersSnapshot.val();
        let nodeUpdates = {};

        nodeUpdates['nodes/' + node.id] = node;
        nodeUpdates['nodes/' + node.parentId + '/childIds'] = updatedParentChildIds;
        
        return firebaseDb.ref().update(nodeUpdates)
            .then(() => {
                let manyToManyDbUpdates = {};
                // give access to each user that has access to the new Node's parent 
                Object.keys(parentNodeUserPagesUsers).forEach(userPageId => {

                    Object.keys(parentNodeUserPagesUsers[userPageId]).forEach(userId => {
                        manyToManyDbUpdates['node_userPages_users/' + node.id + '/' + userPageId + '/' + userId] = true;
                        manyToManyDbUpdates['userPage_users_nodes/' + userPageId + '/' + userId + '/' + node.id] = true;
                        manyToManyDbUpdates['node_users/' + node.id + '/' + userId] = true;
                    });

                });
                
                return firebaseDb.ref().update(manyToManyDbUpdates);
            });
    });
}

export function updateNodeContent(nodeId, newContent, userId){
    let dbUpdates = {};
    dbUpdates['nodes/' + nodeId + '/content'] = newContent;
    dbUpdates['nodes/' + nodeId + '/lastUpdatedById'] = userId;

    return firebaseDb.ref().update(dbUpdates);
}

export function deleteNode(node, updatedParentChildIds, allDescendantIdsOfNode, userId){
    let dbUpdates = {};
    dbUpdates['nodes/' + node.id + '/deleted'] = true;
    dbUpdates['nodes/' + node.id + '/lastUpdatedById/'] = userId;
    dbUpdates['nodes/' + node.parentId + '/childIds/'] = updatedParentChildIds;
    dbUpdates['nodes/' + node.parentId + '/lastUpdatedById/'] = userId;

    allDescendantIdsOfNode.forEach(descedantId => {
        dbUpdates['nodes/' + descedantId + '/deleted'] = true;
        dbUpdates['nodes/' + descedantId + '/lastUpdatedById/'] = userId;
    });

    // TODO: decide if we should delete many to many indices

    //dbUpdates['node_users/' + node.id] = null;

    // allDescendantIds.forEach(descedantId => {
    //     // remove all many to many indices, node_userPages_users and userPage_users_nodes
    //     firebaseDb.ref('node_userPages_users/' + descedantId).once('value').then(nodeUserPageUsersSnapshot => {
    //         Object.keys(nodeUserPageUsersSnapshot.val()).forEach(userPageId => {
    //             dbUpdates['userPage_users_nodes/' + userPageId] = null;
    //         });
    //     });

    //     dbUpdates['node_userPages_users/' + descedantId] = null;
    // });

    return firebaseDb.ref().update(dbUpdates);
}

export function createUserPage(userPage, rootNode, firstNode){
    let createUserPagesAndInitialNodesUpdates = {};
    createUserPagesAndInitialNodesUpdates['nodes/' + rootNode.id] = rootNode;
    createUserPagesAndInitialNodesUpdates['nodes/' + firstNode.id] = firstNode;
    createUserPagesAndInitialNodesUpdates['userPages/' + userPage.createdById + '/' + userPage.id] = userPage;

   	return firebaseDb.ref().update(createUserPagesAndInitialNodesUpdates)
        .then(snapshot => {
            let manyToManyConnectionDbUpdates = {};
            manyToManyConnectionDbUpdates['userPage_users_nodes/' + userPage.id + '/' + userPage.createdById + '/' + rootNode.id] = true;
            manyToManyConnectionDbUpdates['userPage_users_nodes/' + userPage.id + '/' + userPage.createdById + '/' + firstNode.id] = true;
            manyToManyConnectionDbUpdates['node_userPages_users/' + rootNode.id + '/' + userPage.id + '/' + userPage.createdById] = true;
            manyToManyConnectionDbUpdates['node_userPages_users/' + firstNode.id + '/' + userPage.id + '/' + userPage.createdById] = true;
            manyToManyConnectionDbUpdates['node_users/' + rootNode.id + '/' + userPage.createdById] = true;
            manyToManyConnectionDbUpdates['node_users/' + firstNode.id + '/' + userPage.createdById] = true;

            return firebaseDb.ref().update(manyToManyConnectionDbUpdates);
        });
}

export function reassignParentNode(nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, userId){
    // NOTE: This is assuming that specific nodes within a userPage are not shared. If that happens this will need to account for other users having access
    // to the new parent or not and updating the other many to many indices if necessary.

    let dbUpdates = {};
    dbUpdates['nodes/' + nodeId + '/parentId'] = newParentId;
    dbUpdates['nodes/' + nodeId + '/lastUpdatedById'] = userId;

    dbUpdates['nodes/' + oldParentId + '/childIds'] = updatedChildIdsForOldParent;
    dbUpdates['nodes/' + oldParentId + '/lastUpdatedById'] = userId;

    dbUpdates['nodes/' + newParentId + '/childIds'] = updatedChildIdsForNewParent;
    dbUpdates['nodes/' + newParentId + '/lastUpdatedById'] = userId;

    return firebaseDb.ref().update(dbUpdates);
}

export function updateUserPageName(userPage, newUserPageName){
    return firebaseDb.ref('userPages/' + userPage.createdById + '/' + userPage.id).update({ title: newUserPageName });
}

export function deleteUserPage(userPage, rootNode, auth){
    let dbUpdates = {};
    dbUpdates['userPages/' + auth.id + '/' + userPage.id + '/deleted'] = true;

    if(auth.id === rootNode.createdById){
        // the current user is the creator, delete all nodes and access to them
        Object.keys(allDescendantIds).forEach(descedantId => {
            dbUpdates['nodes/' + descedantId + '/deleted'] = true;
        });

        // permanentely delete access, will recreate if we ever need to bring this userPage back to life
        dbUpdates['node_users/' + descedantId] = null;
        
    } else {
        // the root node was shared with the current user, remove only their access
        Object.keys(allDescendantIds).forEach(descedantId => {
            dbUpdates['node_users/' + descedantId + '/' + auth.id] = null;
        });
    }
}

export function shareUserPage(userPageId, emails){

}