// import { firebaseDb } from '../../firebase'
// import * as firebaseRequestQueueActionCreators from '../../requestqueue/actions/firebase-request-queue-action-creators'

// export function createTag (tagId, userPageId) {
//   return dispatch => {
//     dispatch(firebaseRequestQueueActionCreators.enqueueRequest(this, () => {
//       const userTagsUpdate = {
//         [`userpage_tags/${userPageId}/${tagId}`]: true
//       }

//       return firebaseDb.ref().update(userTagsUpdate)
//     }))
//   }
// }

// export function deleteTag (tagId, userPageId) {
//   return dispatch => {
//     dispatch(firebaseRequestQueueActionCreators.enqueueRequest(this, () => {
//       return firebaseDb.ref(`userpage_tags/${userPageId}/${tagId}`).remove()
//     }))
//   }
// }
