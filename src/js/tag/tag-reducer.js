import { TAG_CREATED } from './tag-action-types'
import { INITIAL_NODE_STATE_LOADED } from '../node/node-action-types'

export function tags (state = [], action) {
  switch (action.type) {
    case INITIAL_NODE_STATE_LOADED:
      return Object.assign([], action.payload.initialTagsState)
    case TAG_CREATED:
      let newState = Object.assign([], state)
      if (!state.find(t => t === action.payload.tag.id)) {
        newState.push(action.payload.tag)
      }
      return newState
  }

  return Object.assign([], state)
}
