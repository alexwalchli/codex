import { QUEUE_REQUEST, QUEUED_REQUEST_STARTED, QUEUED_REQUEST_COMPLETED, QUEUED_REQUEST_FAILED,
         QUEUED_REQUEST_PENDING_STATUS, QUEUED_REQUEST_COMPLETED_STATUS, QUEUED_REQUEST_FAILED_STATUS } from '../actions/firebase-request-queue';

function queuedRequest(state, {payload, type}){
  switch (type) {
    case QUEUE_REQUEST:
      return {
        requestId: payload.requestId,
        request: payload.request,
        context: payload.context
      };
    case QUEUED_REQUEST_STARTED:
      return Object.assign({}, state, {
        status: QUEUED_REQUEST_PENDING_STATUS
      });
    case QUEUED_REQUEST_COMPLETED:
      return Object.assign({}, state, {
        status: QUEUED_REQUEST_COMPLETED_STATUS
      });
    case QUEUED_REQUEST_FAILED:
      return Object.assign({}, state, {
        status: QUEUED_REQUEST_FAILED_STATUS
      });
    default:
      return state;
  }
}

export function queuedRequests(state = [], {payload, type}) {
  if(!payload) return state;

  let requestId = payload.requestId;
  let newState = Object.assign({}, state);
  if(requestId){
    let request = newState.find(request => request.id === requestId);
    newState[request.id] = queuedRequest(request, {payload, type});
  }

  return newState;
}