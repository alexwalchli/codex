
let requestQueue = []

export const enqueue = (func, args) => {
  const requestId = requestQueue.length
  const queuedRequest = {
    requestId,
    func,
    args
  }
  const queuedRequestPromise = new Promise((resolve, reject) => {
    queuedRequest.resolve = resolve
    queuedRequest.reject = reject
  })

  requestQueue.push(queuedRequest)
  console.debug('Request Queue: Added request: ' + queuedRequest.requestId)
  if (requestQueue.length === 1) {
    execute()
  }

  return queuedRequestPromise
}

const execute = () => {
  const queuedRequest = requestQueue.shift()
  console.debug('Request Queue: Started request: ' + queuedRequest.requestId)
  queuedRequest.func.apply(null, queuedRequest.args)
    .then((response) => {
      queuedRequest.resolve(response)
      console.debug('Request Queue: Completed request: ' + queuedRequest.requestId)
      if (requestQueue.length > 0) {
        execute()
      }
    })
    .catch((error) => {
      // TODO: what to do here? Stop further updates(some updates are dependent on previous ones? 
      // Need to alert at very least
      console.debug('Request queue error: ' + error.message)
    })
}
