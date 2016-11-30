// import * as firebaseRequestQueueActions from './firebase-request-queue-actions'
// import * as firebaseRequestQueueConstants from '../constants'

// export const executeRequest = (queuedRequest) =>
//   (dispatch, getState) => {
//     dispatch(firebaseRequestQueueActions.queuedRequestStarted(queuedRequest.requestId))

//     queuedRequest.request.apply(queuedRequest.context)
//       .catch((error) => dispatch(firebaseRequestQueueActions.queuedRequestFailed(queuedRequest.requestId, error)))
//       .then(() => {
//         let queuedRequests = getState().queuedRequests
//         let pendingQueuedRequests = queuedRequests.filter(r => r.status === firebaseRequestQueueConstants.QUEUED_REQUEST_PENDING_STATUS)

//         dispatch(firebaseRequestQueueActions.queuedRequestCompleted(queuedRequest.requestId))
//         if (pendingQueuedRequests.length > 0) {
//           dispatch(executeRequest(pendingQueuedRequests[0]))
//         }
//       })
//   }

// export const enqueueRequest = (context, request) =>
//   (dispatch, getState) => {
//     const queuedRequests = getState().queuedRequests
//     const requestId = queuedRequests.length + 1

//     dispatch(firebaseRequestQueueActions.queueRequest(requestId, context, request))
//     if (queuedRequests.filter(r => r.status === firebaseRequestQueueConstants.QUEUED_REQUEST_PENDING_STATUS).length === 0) {
//       dispatch(executeRequest({requestId, context, request}))
//     }
//   }
