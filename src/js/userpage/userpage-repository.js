import { firebaseDb } from '../firebase'
import { queuedRequest } from '../requestqueue/queued-request'
import { userPageSnapshotUnwrapper } from './userpage-snapshot-unwrapper'

export const getUserPages = (userId) => {
  return getUserPageIds(userId)
    .then(userPageIds => {
      if (!userPageIds) {
        return Promise.resolve(null)
      }

      let userPagePromises = Object.keys(userPageIds).map((userPageId) => {
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
  return firebaseDb.ref(`userPagesByUser/${userId}`).once('value').then(snapshot => {
    const userPageIds = snapshot.val()
    return userPageIds
  })
}

export const getNewUserPageId = () => {
  return firebaseDb.ref('userPages').push().key
}

export const createUserPage = queuedRequest((userPage, rootNode, firstNode) => {
  const userPageId = userPage.get('id')
  const createdById = userPage.get('createdById')
  const rootNodeId = rootNode.get('id')
  const firstNodeId = firstNode.get('id')

  let userPagesByUser = {}
  userPagesByUser

  // create the access record first
  return firebaseDb.ref().update({
    [`userPagesByUser/${createdById}/${userPageId}`]: true
  }).then((snapshot) => {
    // create access record for initial nodes
    return firebaseDb.ref().update({
      [`nodesByUserPage/${userPageId}/${rootNodeId}`]: true,
      [`nodesByUserPage/${userPageId}/${firstNodeId}`]: true
    })
  }).then((snapshot) => {
    // create nodes and user page
    return firebaseDb.ref().update({
      [`nodes/${rootNodeId}`]: rootNode.toJS(),
      [`nodes/${firstNodeId}`]: firstNode.toJS(),
      [`userPages/${userPageId}`]: userPage.toJS()
    })
  })
})

export const deleteUserPage = queuedRequest((userPage, rootNode, auth) => {
  let dbUpdates = {}
  dbUpdates[`userPages/${userPage.id}/deleted`] = true
})
