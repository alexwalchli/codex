import * as tagActionTypes from './tag-action-types'

export const tagCreated = (type, id, label) => ({
  type: tagActionTypes.TAG_CREATED,
  payload: {
    tag: { type, id, label }
  }
})
