
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

  if (requestQueue.length === 1) {
    execute()
  }

  return queuedRequestPromise
}

const execute = () => {
  const queuedRequest = requestQueue.shift()
  queuedRequest.func.apply(null, queuedRequest.args)
    .then((response) => {
      queuedRequest.resolve(response)
      if (requestQueue.length > 0) {
        execute()
      }
    })
    .catch((error) => {
      console.debug('Error in request queue: ' + error.message)
    })
}
