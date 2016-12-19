import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'
import { userPageSnapshotUnwrapper } from './userpage-snapshot-unwrapper'
import * as I from 'immutable'

export const getUserPages = (userId) => {
  return getUserPageIds(userId)
    .then(userPageIds => {
      let userPagePromises = userPageIds.map((userPageId) => {
        return new Promise((resolve, reject) => {
          firebaseDb.ref(`userPages/${userPageId}`).once('value').then(snapshot => {
            resolve(userPageSnapshotUnwrapper(snapshot))
          })
        })
      })

      return Promise.all(userPagePromises)
    })
}

export const getUserPageIds = (userId) => {
  return firebaseDb.ref(`user_userpages/${userId}`).once('value').then(snapshot => {
    const userPageIds = snapshot.val()
    return userPageIds
  })
}

export const getNewUserPageId = () => {
  return firebaseDb.ref('userPages').push().key
}

// export const createUserPage = queuedRequest((userPage, rootNode, firstNode) => {
//   const userPageId = userPage.get('id')
//   const createdById = userPage.get('createdById')
//   const rootNodeId = rootNode.get('id')
//   const firstNodeId = firstNode.get('id')
//   let createUserPagesAndInitialNodesUpdates = {}
//   createUserPagesAndInitialNodesUpdates[`nodes/${rootNodeId}`] = rootNode.toJS()
//   createUserPagesAndInitialNodesUpdates[`nodes/${firstNodeId}`] = firstNode.toJS()
//   createUserPagesAndInitialNodesUpdates[`userPages/${createdById}/${userPageId}`] = userPage.toJS()

//   return firebaseDb.ref().update(createUserPagesAndInitialNodesUpdates)
//     .then(snapshot => {
//       let manyToManyConnectionDbUpdates = {}
//       manyToManyConnectionDbUpdates[`userPage_users_nodes/${userPageId}/${userPage.createdById}/${rootNodeId}`] = true
//       manyToManyConnectionDbUpdates[`userPage_users_nodes/${userPageId}/${userPage.createdById}/${firstNodeId}`] = true
//       manyToManyConnectionDbUpdates[`node_userPages_users/${rootNodeId}/${userPageId}/${createdById}`] = true
//       manyToManyConnectionDbUpdates[`node_userPages_users/${firstNodeId}/${userPageId}/${createdById}`] = true
//       manyToManyConnectionDbUpdates[`node_users/${rootNodeId}/${createdById}`] = true
//       manyToManyConnectionDbUpdates[`node_users/${firstNodeId}/${createdById}`] = true

//       return firebaseDb.ref().update(manyToManyConnectionDbUpdates)
//     })
// })

// export const updateUserPageName = queuedRequest((userPage, newUserPageName) => {
//   return firebaseDb.ref(`userPages/${userPage.createdById}/${userPage.id}`).update({ title: newUserPageName })
// })

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

// TODO: take a look back at this when it's time to work on collaboration/sharing
// export const shareUserPage = queuedRequest((userPage, allDescendantIds, emails, auth) => {
//   let newUserPageUpdates = {}
//   let manyToManyConnectionDbUpdates = {}
//   let shareUserPagePromises = []

//   if (!emails) {
//     return
//   }

//   emails.forEach(email => {
//     // for each user that matches with an entered email, create a userPage and records to connect to all descendants
//     let shareUserPagePromise = new Promise((resolve, reject) => {
//       firebaseDb.ref(`email_users/${escapeEmail(email)}`).once(`value`).then(snapshot => {
//         let userId = snapshot.val()

//         if (!userId || email === auth.email) {
//           return
//         }

//         // TODO: ROOTNODEID and CREATEDBYID UNDEFINED

//         let newUserPageId = firebaseDb.ref(`userPages/`).push().key
//         let newUserPage = userPageFactory(newUserPageId, userPage.rootNodeId, userPage.createdById, userPage.title, false)
//         newUserPageUpdates[`userPages/${userId}/${newUserPageId}`] = newUserPage
//         manyToManyConnectionDbUpdates[`userPage_users_nodes/${newUserPageId}/${userId}/${userPage.rootNodeId}`] = true
//         manyToManyConnectionDbUpdates[`node_userPages_users/${userPage.rootNodeId}/${newUserPageId}/${userId}`] = true
//         manyToManyConnectionDbUpdates[`node_users/${userPage.rootNodeId}/${userId}`] = true
//         allDescendantIds.forEach(descedantId => {
//           manyToManyConnectionDbUpdates['userPage_users_nodes/' + newUserPageId + '/' + userId + '/' + descedantId] = true
//           manyToManyConnectionDbUpdates['node_userPages_users/' + descedantId + '/' + newUserPageId + '/' + userId] = true
//           manyToManyConnectionDbUpdates['node_users/' + descedantId + '/' + userId] = true
//         })

//         resolve()
//       })
//     })

//     shareUserPagePromises.push(shareUserPagePromise)
//   })

//   return Promise.all(shareUserPagePromises).then(() => {
//     firebaseDb.ref().update(newUserPageUpdates).then(() => {
//       firebaseDb.ref().update(manyToManyConnectionDbUpdates)
//     })
//   })
// })

// export function createEmailUser (email, userId) {
//   email = email.replace(/\./g, ',')
//   return firebaseDb.ref('email_users/' + email).set(userId)
// }

// function escapeEmail (email) {
//   return (email || '').replace('.', ',')
// }
