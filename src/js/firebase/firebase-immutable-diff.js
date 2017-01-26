import * as I from 'immutable'

const noopCallback = {
  predicate: (diffPath) => (false),
  callback: (updates) => (updates)
}

export const diffsToFirebaseUpdate = (collectionName, diff, callbacks = {}, specialPropHandling = I.Map({})) => {
  callbacks.add = callbacks.add || noopCallback
  callbacks.remove = callbacks.remove || noopCallback
  callbacks.replace = callbacks.replace || noopCallback

  return diff.reduce((updates, d) => {
    const op = d.get('op')
    const diffPath = collectionName + d.get('path')
    const value = extractValue(d.get('value'))

    var handleSpecial = specialPropHandling.find((v, k) => diffPath.includes(k))
    if (handleSpecial) {
      updates = handleSpecial(updates, diffPath, value)
    } else {
      if (op === 'remove') {
        updates[diffPath] = null
      } else {
        updates[diffPath] = value
      }
    }
    if (callbacks[op].predicate(diffPath)) {
      updates = callbacks[op].callback(updates, diffPath)
    }

    return updates
  }, {})
}

function extractValue (value) {
  if (I.Iterable.isIterable(value)) {
    return value.toJS()
  }
  return value
}
