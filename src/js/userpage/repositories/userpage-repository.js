import { firebaseDb } from '../../firebase'
import userPageFactory from '../helpers/userpage-factory'
import { dictionaryToArray } from '../../node/selectors/node-selectors'
import { queuedRequest } from '../../requestqueue/queued-request'

export const getUserPages = (userId) => {
  return firebaseDb.ref('userPages/' + userId).once('value').then(snapshot => {
    return dictionaryToArray(snapshot.val())
  })
}

export const getNewUserPageId = () => {
  return firebaseDb.ref('userPages').push().key
}

export const createUserPage = queuedRequest((userPage, rootNode, firstNode) => {
  let createUserPagesAndInitialNodesUpdates = {}
  createUserPagesAndInitialNodesUpdates[`nodes/${rootNode.id}`] = rootNode
  createUserPagesAndInitialNodesUpdates[`nodes/${firstNode.id}`] = firstNode
  createUserPagesAndInitialNodesUpdates[`userPages/${userPage.createdById}/${userPage.id}`] = userPage

  return firebaseDb.ref().update(createUserPagesAndInitialNodesUpdates)
    .then(snapshot => {
      let manyToManyConnectionDbUpdates = {}
      manyToManyConnectionDbUpdates[`userPage_users_nodes/${userPage.id}/${userPage.createdById}/${rootNode.id}`] = true
      manyToManyConnectionDbUpdates[`userPage_users_nodes/${userPage.id}/${userPage.createdById}/${firstNode.id}`] = true
      manyToManyConnectionDbUpdates[`node_userPages_users/${rootNode.id}/${userPage.id}/${userPage.createdById}`] = true
      manyToManyConnectionDbUpdates[`node_userPages_users/${firstNode.id}/${userPage.id}/${userPage.createdById}`] = true
      manyToManyConnectionDbUpdates[`node_users/${rootNode.id}/${userPage.createdById}`] = true
      manyToManyConnectionDbUpdates[`node_users/${firstNode.id}/${userPage.createdById}`] = true

      return firebaseDb.ref().update(manyToManyConnectionDbUpdates)
    })
})

export const updateUserPageName = queuedRequest((userPage, newUserPageName) => {
  return firebaseDb.ref(`userPages/${userPage.createdById}/${userPage.id}`).update({ title: newUserPageName })
})

export const deleteUserPage = queuedRequest((userPage, rootNode, auth) => {
  let dbUpdates = {}
  dbUpdates[`userPages/${auth.id}/${userPage.id}/deleted`] = true

  if (auth.id === rootNode.createdById) {
    // the current user is the creator, delete all nodes and access to them
    // Object.keys(allDescendantIds).forEach(descedantId => {
    //   dbUpdates[`nodes/${descedantId}/deleted`] = true
    // })

  // permanentely delete access, will recreate if we ever need to bring this userPage back to life
   // dbUpdates[`node_users/${descedantId}`] = null
  } else {
    // the root node was shared with the current user, remove only their access
    // Object.keys(allDescendantIds).forEach(descedantId => {
    //   dbUpdates[`node_users/${descedantId}/${auth.id}`] = null
    // })
  }
})

export const shareUserPage = queuedRequest((userPage, allDescendantIds, emails, auth) => {
  let newUserPageUpdates = {}
  let manyToManyConnectionDbUpdates = {}
  let shareUserPagePromises = []

  if (!emails) {
    return
  }

  emails.forEach(email => {
    // for each user that matches with an entered email, create a userPage and records to connect to all descendants
    let shareUserPagePromise = new Promise((resolve, reject) => {
      firebaseDb.ref(`email_users/${escapeEmail(email)}`).once(`value`).then(snapshot => {
        let userId = snapshot.val()

        if (!userId || email === auth.email) {
          return
        }

        // TODO: ROOTNODEID and CREATEDBYID UNDEFINED

        let newUserPageId = firebaseDb.ref(`userPages/`).push().key
        let newUserPage = userPageFactory(newUserPageId, userPage.rootNodeId, userPage.createdById, userPage.title, false)
        newUserPageUpdates[`userPages/${userId}/${newUserPageId}`] = newUserPage
        manyToManyConnectionDbUpdates[`userPage_users_nodes/${newUserPageId}/${userId}/${userPage.rootNodeId}`] = true
        manyToManyConnectionDbUpdates[`node_userPages_users/${userPage.rootNodeId}/${newUserPageId}/${userId}`] = true
        manyToManyConnectionDbUpdates[`node_users/${userPage.rootNodeId}/${userId}`] = true
        allDescendantIds.forEach(descedantId => {
          manyToManyConnectionDbUpdates['userPage_users_nodes/' + newUserPageId + '/' + userId + '/' + descedantId] = true
          manyToManyConnectionDbUpdates['node_userPages_users/' + descedantId + '/' + newUserPageId + '/' + userId] = true
          manyToManyConnectionDbUpdates['node_users/' + descedantId + '/' + userId] = true
        })

        resolve()
      })
    })

    shareUserPagePromises.push(shareUserPagePromise)
  })

  return Promise.all(shareUserPagePromises).then(() => {
    firebaseDb.ref().update(newUserPageUpdates).then(() => {
      firebaseDb.ref().update(manyToManyConnectionDbUpdates)
    })
  })
})

export function createEmailUser (email, userId) {
  email = email.replace(/\./g, ',')
  return firebaseDb.ref('email_users/' + email).set(userId)
}

function escapeEmail (email) {
  return (email || '').replace('.', ',')
}
