import { firebaseDb } from '../firebase'

export const getNodeIds = (userPageId, userId) => {
  const userPageUsersNodesRef = firebaseDb.ref(`userPage_users_nodes/${userPageId}/${userId}`)
  return userPageUsersNodesRef.once('value').then(userPageUsersNodesSnapshot => {
    return Object.keys(userPageUsersNodesSnapshot.val())
  })
}
