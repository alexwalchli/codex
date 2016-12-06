import * as nodeSelectors from './node-selectors'
import reducerFactory from '../redux/reducer-factory'
import * as I from 'immutable'
import {
  NODE_CREATION,
  NODE_COLLAPSE,
  NODE_EXPANSION,
  NODE_DELETION,
  INITIAL_TREE_STATE_LOAD } from './node-action-types'

export const visibleNodes = reducerFactory({}, {
  [INITIAL_TREE_STATE_LOAD]: (state, action) => {
    const { initialTreeState, rootNodeId, userId } = action.payload
    return initialTreeState.reduce((visibleNodes, node) => {
      if (node.get('id') === rootNodeId) {
        return visibleNodes.set(rootNodeId, true)
      }

      if (node.get('deleted')) {
        visibleNodes = visibleNodes.set(node.get('id'), false)
      }

      // if this node is collapsed set all descendants to hidden
      if (node.getIn(['collapsedBy', userId])) {
        visibleNodes = nodeSelectors.getAllDescendantIds(initialTreeState, node.get('id')).reduce((t, descendantId) => {
          return t.set(descendantId, false)
        }, visibleNodes)
      }

      // we're initializing so we only need to set visibility if it hasn't been set yet
      if (visibleNodes.get(node.get('id')) === undefined) {
        visibleNodes = visibleNodes.set(node.get('id'), true)
      }

      return visibleNodes
    }, I.Map({}))
  },
  [NODE_CREATION]: (state, action) => {
    return state.set(action.payload.nodeId, true)
  },
  [NODE_COLLAPSE]: (state, action) => {
    const { descendantIds } = action.payload
    return descendantIds.reduce((acc, id) => {
      return acc.set(id, false)
    }, state)
  },
  [NODE_EXPANSION]: (state, action) => {
    const { uncollapsedDescendantIds } = action.payload
    return uncollapsedDescendantIds.reduce((acc, id) => {
      return acc.set(id, true)
    }, state)
  },
  [NODE_DELETION]: (state, action) => {
    const { nodeId, allDescendantIds } = action.payload
    return [ nodeId, ...allDescendantIds ].reduce((acc, nid) => {
      return acc.set(nid, false)
    }, state)
  }
})
