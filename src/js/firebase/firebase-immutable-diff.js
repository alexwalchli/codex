import * as I from 'immutable'

const noop = (updates) => (updates)

export const diffsToFirebaseUpdate = (collectionName, diff, callbacks = {}, specialPropHandling = I.Map({})) => {
  callbacks.add = callbacks.add || noop
  callbacks.remove = callbacks.remove || noop
  callbacks.replace = callbacks.replace || noop

  return diff.reduce((updates, d) => {
    const op = d.get('op')
    const diffPath = collectionName + d.get('path')
    const value = extractValue(d.get('value'))

    var handleSpecial = specialPropHandling.find((v, k) => diffPath.includes(k))
    if(handleSpecial){
      updates = handleSpecial(updates, diffPath, value)
    } else {
      if (op === 'remove') {
        updates[diffPath] = null
      } else {
        updates[diffPath] = value
      }
    }

    updates = callbacks[op](updates, diffPath)

    return updates
  }, {})
}

function extractValue (value) {
  if (I.Iterable.isIterable(value)) {
    return value.toJS()
  }
  return value
}
