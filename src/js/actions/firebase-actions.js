import { firebaseDb } from '../firebase';
import userPageFactory from '../utilities/user-page-factory'; 
import * as firebaseRequestQueueActions from './firebase-request-queue';

function unwrapNodeSnapshot(nodeSnapshot){
  let node = nodeSnapshot.val();
  node.childIds = node.childIds || [];
  return node;
}

export function getNodeSnapshot(nodeId){
  return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
    return unwrapNodeSnapshot(snapshot);
  });
}

export function createNode(node, userPageId, updatedParentChildIds){
  return dispatch => {
    dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref('node_userPages_users/' + node.parentId).once('value').then(parentNodeUserPagesUsersSnapshot => {
        const parentNodeUserPagesUsers = parentNodeUserPagesUsersSnapshot.val();
        const nodeUpdates = {
          [`nodes/${node.id}`] : node,
          [`nodes/${node.parentId}/childIds`]: updatedParentChildIds,
          [`nodes/${node.parentId}/lastUpdatedById`]: node.createdById
        };

        Object.keys(parentNodeUserPagesUsers).forEach(userPageId => {
          Object.keys(parentNodeUserPagesUsers[userPageId]).forEach(userId => {
            nodeUpdates[`node_users/${node.id}/${userId}`] = true;
            nodeUpdates[`node_userPages_users/${node.id}/${userPageId}/${userId}`] = true;
            nodeUpdates[`userPage_users_nodes/${userPageId}/${userId}/${node.id}`] = true;
          });
        });

        return firebaseDb.ref().update(nodeUpdates);
      });
    }));
  };
}

export function updateNodeSelectedByUser(nodeId, userId, userDisplayName){
  return dispatch => {
    let dbUpdates = {
      [`nodes/${nodeId}/currentlySelectedById`] : userId,
      [`nodes/${nodeId}/currentlySelectedBy`] : userDisplayName
    };

    dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
        if(snapshot.val()){
          return firebaseDb.ref().update(dbUpdates);
        }

        return Promise.resolve();
      });
    }));
  };
}

export function updateNodeContent(nodeId, newContent, userId){
  return dispatch => {
    let dbUpdates = {
      [`nodes/${nodeId}/content`] : newContent,
      [`nodes/${nodeId}/lastUpdatedById`] : userId
    };

    dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref(`nodes/${nodeId}`).once('value').then(snapshot => {
        if(snapshot.val()){
          return firebaseDb.ref().update(dbUpdates);
        }
        return Promise.resolve();
      });
    }));
  };
}

export function deleteNode(node, updatedParentChildIds, allDescendantIdsOfNode, userId){
  return dispatch => {
    let dbUpdates = {
      [`nodes/${node.id}/deleted`] : true,
      [`nodes/${node.id}/lastUpdatedById/`] : userId,
      [`nodes/${node.parentId}/childIds/`] : updatedParentChildIds,
      [`nodes/${node.parentId}/lastUpdatedById/`] : userId
    };

    allDescendantIdsOfNode.forEach(descedantId => {
      dbUpdates[`nodes/${descedantId}/deleted`] = true;
      dbUpdates[`nodes/${descedantId}/lastUpdatedById/`] = userId;
    });

    return dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref(`nodes/${node.id}`).once('value').then(snapshot => {
        if(snapshot.val()){
          return firebaseDb.ref().update(dbUpdates);
        }

        return Promise.resolve();
      });
    }));
  };
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
  return dispatch => {
    // NOTE: This is assuming that specific nodes within a userPage are not shared. If that happens this will need to account for other users having access
    // to the new parent or not and updating the other many to many indices if necessary.
    let dbUpdates = {};
    dbUpdates['nodes/' + nodeId + '/parentId'] = newParentId;
    dbUpdates['nodes/' + nodeId + '/lastUpdatedById'] = userId;

    dbUpdates['nodes/' + oldParentId + '/childIds'] = updatedChildIdsForOldParent;
    dbUpdates['nodes/' + oldParentId + '/lastUpdatedById'] = userId;

    dbUpdates['nodes/' + newParentId + '/childIds'] = updatedChildIdsForNewParent;
    dbUpdates['nodes/' + newParentId + '/lastUpdatedById'] = userId;

    return dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref('nodes/' + nodeId).once('value').then(snapshot => {
        if(snapshot.val()){
          return firebaseDb.ref().update(dbUpdates); 
        }

        return Promise.resolve();
      });
    }));
  };
}

export function updateUserPageName(userPage, newUserPageName){
  return firebaseDb.ref(`userPages/${userPAge.createdById}/${userPage.id}`).update({ title: newUserPageName });
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

export function shareUserPage(userPage, allDescendantIds, emails, auth){
  let newUserPageUpdates = {},
  manyToManyConnectionDbUpdates = {},
  shareUserPagePromises = [];

  if(!emails){
    return;
  }

  emails.forEach(email => {
    // for each user that matches with an entered email, create a userPage and records to connect to all descendants
    let shareUserPagePromise = new Promise((resolve, reject) => {

      firebaseDb.ref('email_users/' + escapeEmail(email)).once('value').then(snapshot => {
        let userId = snapshot.val();

        if(!userId || email === auth.email){ 
          return; 
        }

    // TODO: ROOTNODEID and CREATEDBYID UNDEFINED

        let newUserPageId = firebaseDb.ref('userPages/').push().key;
        let newUserPage = userPageFactory(newUserPageId, userPage.rootNodeId, userPage.createdById, userPage.title, false);
        newUserPageUpdates['userPages/' + userId + '/' + newUserPageId] = newUserPage;
        manyToManyConnectionDbUpdates['userPage_users_nodes/' + newUserPageId + '/' + userId + '/' + userPage.rootNodeId] = true;
        manyToManyConnectionDbUpdates['node_userPages_users/' + userPage.rootNodeId + '/' + newUserPageId + '/' + userId] = true;
        manyToManyConnectionDbUpdates['node_users/' + userPage.rootNodeId + '/' + userId] = true;
        allDescendantIds.forEach(descedantId => {
          manyToManyConnectionDbUpdates['userPage_users_nodes/' + newUserPageId + '/' + userId + '/' + descedantId] = true;
          manyToManyConnectionDbUpdates['node_userPages_users/' + descedantId + '/' + newUserPageId + '/' + userId] = true;
          manyToManyConnectionDbUpdates['node_users/' + descedantId + '/' + userId] = true;
        });

        resolve();
      });

    });

    shareUserPagePromises.push(shareUserPagePromise);

  });

  return Promise.all(shareUserPagePromises).then(() => {
    firebaseDb.ref().update(newUserPageUpdates).then(() => {
      firebaseDb.ref().update(manyToManyConnectionDbUpdates);
    });
  });
}

export function createEmailUser(email, userId){
  let dbUpdates = {};
  email  =  email.replace(/\./g, ",");
  return firebaseDb.ref('email_users/' + email).set(userId);
}

function escapeEmail(email) {
  return (email || '').replace('.', ',');
}

function unescapeEmail(email) {
  return (email || '').replace(',', '.');
}

function unwrapNodeSnapshot(nodeSnapshot){
  let node = nodeSnapshot.val();
  node.childIds = node.childIds || [];
  return node;
}