import { firebaseDb } from '../firebase';
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

export function updateNodeComplete(nodeId, complete){
  return dispatch => {
    dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref().update({
        [`nodes/${nodeId}/completed`] : complete
      });
    }));
  }; 
}

export function updateNodeNotes(nodeId, notes){
  return dispatch => {
    dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref().update({
        [`nodes/${nodeId}/notes`] : notes
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

export function reassignParentNode(nodeId, oldParentId, newParentId, updatedChildIdsForOldParent, updatedChildIdsForNewParent, userId){
  return dispatch => {
    // NOTE: This is assuming that specific nodes within a userPage are not shared. If that happens this will need to account for other users having access
    // to the new parent or not and updating the other many to many indices if necessary.
    let dbUpdates = {};
    dbUpdates[`nodes/${nodeId}/parentId`] = newParentId;
    dbUpdates[`nodes/${nodeId}/lastUpdatedById`] = userId;

    dbUpdates[`nodes/${oldParentId}/childIds`] = updatedChildIdsForOldParent;
    dbUpdates[`nodes/${oldParentId}/lastUpdatedById`] = userId;

    dbUpdates[`nodes/${newParentId}/childIds`] = updatedChildIdsForNewParent;
    dbUpdates[`nodes/${newParentId}/lastUpdatedById`] = userId;

    return dispatch(firebaseRequestQueueActions.enqueueRequest(this, () => {
      return firebaseDb.ref(`nodes/${nodeId}`).once(`value`).then(snapshot => {
        if(snapshot.val()){
          return firebaseDb.ref().update(dbUpdates); 
        }

        return Promise.resolve();
      });
    }));
  };
}