// request statuses
export const QUEUED_REQUEST_PENDING_STATUS = `PENDING`;
export const QUEUED_REQUEST_STARTED_STATUS = `STARTED`;
export const QUEUED_REQUEST_FAILED_STATUS = `FAILED`;

export function executeRequest(queuedRequest){
  return (dispatch, getState) => {
    dispatch(queuedRequestStarted(queuedRequest.requestId));

    queuedRequest.request.apply(queuedRequest.context)
      .catch((error) => dispatch(queuedRequestFailed(queuedRequest.requestId, error)))
      .then(() => {
        let queuedRequests = getState().queuedRequests;
        let pendingQueuedRequests = queuedRequests.filter(r => r.status === QUEUED_REQUEST_PENDING_STATUS);

        dispatch(queuedRequestCompleted(queuedRequest.requestId));
        if(pendingQueuedRequests.length > 0){
          dispatch(executeRequest(pendingQueuedRequests[0]));   
        }
      });
  };
}

export function enqueueRequest(context, request){
  return (dispatch, getState) => {
    const queuedRequests = getState().queuedRequests;
    const requestId = queuedRequests.length + 1;

    dispatch(queueRequest(requestId, context, request));
    if(queuedRequests.filter(r => r.status === QUEUED_REQUEST_PENDING_STATUS).length === 0){
      dispatch(executeRequest({requestId, context, request}));
    }
  }; 
}

// queued request action types
export const QUEUE_REQUEST = `QUEUE_REQUEST`;
export const QUEUED_REQUEST_STARTED = `QUEUED_REQUEST_STARTED`;
export const QUEUED_REQUEST_FAILED = `QUEUED_REQUEST_FAILED`;
export const QUEUED_REQUEST_COMPLETED = `QUEUED_REQUEST_COMPLETED`;

function queueRequest(requestId, context, request){
  return {
    type: QUEUE_REQUEST,
    payload: {
      requestId,
      context, 
      request
    }
  };
}

function queuedRequestStarted(requestId){
  return {
    type: QUEUED_REQUEST_STARTED,
    payload: {requestId}
  };
}

function queuedRequestCompleted(requestId){
  return {
    type: QUEUED_REQUEST_COMPLETED,
    payload: {requestId}
  };
}

function queuedRequestFailed(requestId, error){
  return {
    type: QUEUED_REQUEST_FAILED,
    payload: {requestId, error}
  };
}