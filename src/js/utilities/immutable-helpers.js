
export const setMany = (state, keys, attrs) => (
  keys.reduce((acc, k) =>
    (acc.updateIn([k], v => v.merge(attrs)))
  , state)
)

export const updateMany = (state, keys, updater) => {
  return keys.reduce((acc, k) => {
    return acc.update(k, updater)
  }, state)
}
