export function dictionaryToArray (dictionary) {
  if (!dictionary) {
    return null
  }
  return Object.keys(dictionary).map(key => dictionary[key])
}

export function currentTreeState (state) {
  // const currentTreeState = state.get('tree').get('present') When I reimplment undo functionality we'll need this
  const currentTreeState = state.get('tree')
  return currentTreeState.filter(node => !node.get('deleted'))
}

// retrieves the root node ID of the current page
export function getRootNodeId (state) {
  let currentUserPageId = state.get('app').get('currentUserPageId')
  return state.get('userPages').find(up => up.get('id') === currentUserPageId).get('rootNodeId')
}

// retrieves a flattened ordered list of all node IDs starting under startNodeId
export function getAllNodeIdsOrdered (nodes, startNodeId) {
  let allOrderedChildIds = getAllDescendantIds(nodes, startNodeId)
  return [ startNodeId, ...allOrderedChildIds ]
}

// recursively retrieves, and flattens, all node IDs under the startNodeId
export function getAllDescendantIds (nodes, startNodeId) {
  return nodes.getIn([startNodeId, 'childIds']).reduce((acc, childId) => {
    if (!nodes.getIn([childId, 'deleted'])) {
      return [ ...acc, childId, ...getAllDescendantIds(nodes, childId) ]
    }
    return acc
  }, [])
}

// recursively retrieves, and flattens, all node Ids excluding children of collapsed nodes, except children of the start node
export function getAllUncollapsedDescedantIds (rootNodeId, nodes, startNodeId, userId) {
  return nodes.getIn([startNodeId, 'childIds']).reduce((acc, childId) => {
    if (rootNodeId !== startNodeId && !nodes.get(nodes.getIn([childId, 'parentId'])).getIn(['collapsedBy', userId])) {
      return acc
    }
    return [ ...acc, childId, ...getAllUncollapsedDescedantIds(rootNodeId, nodes, childId) ]
  }, [])
}

export function getCurrentlySelectedNodeIds (nodes) {
  return nodes.filter(n => n.get('selected')).map(n => n.get('id')).toList()
}

export function getCurrentlyFocusedNodeId (nodes) {
  let focusedNode = nodes.find(n => n.get('focused') || n.get('notesFocused'))
  return focusedNode ? focusedNode.get('id') : null
}

// retrieves the next node above or below that is visible
export function getNextNodeThatIsVisible (rootNodeId, nodes, visibleNodes, currentNodeId, searchAbove = true) {
  const allNodeIdsOrdered = getAllNodeIdsOrdered(nodes, rootNodeId)
  const currentNodeIndex = allNodeIdsOrdered.indexOf(currentNodeId)
  if (searchAbove) {
    for (let j = currentNodeIndex - 1; j > 0; j--) {
      let node = nodes.get(allNodeIdsOrdered[j])
      if (visibleNodes.get(node.get('id'))) {
        return node
      }
    }
  } else {
    for (let k = currentNodeIndex + 1; k < allNodeIdsOrdered.length; k++) {
      let node = nodes.get(allNodeIdsOrdered[k])
      if (visibleNodes.get(node.get('id'))) {
        return node
      }
    }
  }

  return null
}

export const getNodeDataForComponent = (state, id, parentId) => {
  const nodeFromState = state.tree.present[id]
  const parentNode = state.tree.present[parentId]
  const rootNodeId = getRootNodeId(state)

  let positionInOrderedList
  if (parentNode && parentNode.displayMode === 'ordered') {
    positionInOrderedList = parentNode.childIds.indexOf(id) + 1
  }

  return {
    rootNodeId,
    nodeInitialized: !!nodeFromState,
    auth: state.auth,
    positionInOrderedList,
    lastChild: parentNode && parentNode.childIds.indexOf(id) === parentNode.childIds.length - 1,
    visible: state.visibleNodes.present[id],
    ...nodeFromState
  }
}
