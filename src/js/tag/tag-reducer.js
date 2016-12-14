import { reducerFactory } from '../redux/reducer-factory'
import * as I from 'immutable'
import { INITIAL_NODE_STATE_LOADED, NODE_CONTENT_UPDATE } from '../node/node-action-types'

const initialTagsState = I.Map({})
export const tags = reducerFactory(initialTagsState, {
  [INITIAL_NODE_STATE_LOADED]: (state, action) => {

  },
  [NODE_CONTENT_UPDATE]: (state, action) => {
    const { tags } = action.payload
    return tags.reduce((acc, tag) => {
      return acc.set(tag, true)
    }, state)
  }
})
