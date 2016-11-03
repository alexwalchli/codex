import { NODE_CREATED, NODE_EXPANDED, NODE_COLLAPSED, NODES_DELETED, NODE_TRANSACTION }
    from '../actions/node'
import { dictionaryToArray, getAllDescendantIds } from '../utilities/tree-queries'
import { INITIAL_NODE_STATE_LOADED } from '../actions/firebase/firebase-subscriptions'

export function nodeVisibility (state = {}, action) {
  let newState = Object.assign({}, state)

  if (action.type === NODE_TRANSACTION) {
    action.payload.forEach(a => {
      newState = handleAction(newState, a)
    })
    return newState
  } else {
    return handleAction(newState, action)
  }
}

function handleAction (newState, action) {
  switch (action.type) {
    case INITIAL_NODE_STATE_LOADED:
      dictionaryToArray(action.payload.initialTreeState).forEach(node => {
        if (node.id === action.payload.rootNodeId) {
          newState[action.payload.rootNodeId] = true
          return
        }

        // if this node is collapsed set all descendants to hidden
        if (node.collapsedBy[action.payload.userId]) {
          getAllDescendantIds(action.payload.initialTreeState, node.id).forEach(descendantId => {
            newState[descendantId] = false
          })
        }

        // we're initializing so we only need to set visibility if it hasn't been set yet
        if (newState[node.id] === undefined) {
          newState[node.id] = true
        }
      })
      break
    case NODE_COLLAPSED:
      action.payload.allDescendentIds.forEach(descendantId => {
        newState[descendantId] = false
      })
      break
    case NODE_EXPANDED:
      action.payload.allDescendentIds.forEach(descendantId => {
        newState[descendantId] = true
      })
      break
    case NODES_DELETED:
      action.payload.nodeIds.forEach(nodeId => {
        newState[nodeId] = false
      })
      break
    case NODE_CREATED:
      newState[action.nodeId] = true
      break
    default:
      break

  // TODO: Searching
  //   if (action.type === NODES_SEARCHED) {
  //   dictionaryToArray(newState).forEach((n) => {
  //     if (action.payload.resultingNodeIds.indexOf(n.id) === -1) {
  //       newState[n.id] = node(n, { type: NODE_HIDDEN })
  //     } else {
  //       newState[n.id] = node(n, { type: NODE_SHOWN })
  //     }
  //   })

  //   return newState
  // }
  }

  return newState
}
