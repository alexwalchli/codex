import * as nodeSelectors from '../selectors/node-selectors'
import reducerFactory from '../../redux/reducer-factory'
import {
  NODE_CREATION,
  NODE_COLLAPSE,
  NODE_EXPANSION,
  NODE_DELETION,
  INITIAL_TREE_STATE_LOAD } from '../actions/node-action-types'

export const visibleNodes = reducerFactory({}, {
  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    let newState = Object.assign({}, state)
    nodeSelectors.dictionaryToArray(action.payload.initialTreeState).forEach(node => {
      if (node.id === action.payload.rootNodeId) {
        newState[action.payload.rootNodeId] = true
        return
      }

      if (node.deleted) {
        newState[node.id] = false
      }

      // if this node is collapsed set all descendants to hidden
      if (node.collapsedBy[action.payload.userId]) {
        nodeSelectors.getAllDescendantIds(action.payload.initialTreeState, node.id).forEach(descendantId => {
          newState[descendantId] = false
        })
      }

      // we're initializing so we only need to set visibility if it hasn't been set yet
      if (newState[node.id] === undefined) {
        newState[node.id] = true
      }
    })

    return newState
  },
  [NODE_CREATION]: (state, action) => {
    return Object.assign({}, state, {
      [action.payload.nodeId]: true
    })
  },
  [NODE_COLLAPSE]: (state, action) => {
    const { descendantIds } = action.payload
    return descendantIds.reduce((acc, id) => {
      acc[id] = false
      return acc
    }, Object.assign({}, state))
  },
  [NODE_EXPANSION]: (state, action) => {
    const { uncollapsedDescendantIds } = action.payload
    return uncollapsedDescendantIds.reduce((acc, id) => {
      acc[id] = true
      return acc
    }, Object.assign({}, state))
  },
  [NODE_DELETION]: (state, action) => {
    const { nodeId, allDescendantIds } = action.payload
    return [ nodeId, ...allDescendantIds ].reduce((acc, nid) => {
      acc[nid] = false
      return acc
    }, Object.assign({}, state))
  }
})
