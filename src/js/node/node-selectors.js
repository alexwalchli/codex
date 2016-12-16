export function dictionaryToArray (dictionary) {
  if (!dictionary) {
    return null
  }
  return Object.keys(dictionary).map(key => dictionary[key])
}

export function getNode (state, nodeId) {
  return state.tree.get(nodeId)
}

export function currentTreeState (state) {
  // const currentTreeState = state.get('tree').get('present') When I reimplment undo functionality we'll need this
  return state.tree.filter(node => !node.get('deleted'))
}

// retrieves the root node ID of the current page
export function getRootNodeId (state) {
  let currentUserPageId = state.app.get('currentUserPageId')
  return state.userPages.find(up => up.get('id') === currentUserPageId).get('rootNodeId')
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
export function getVisibleNodesIfNodeWasExpanded (startNodeId, nodes, nodeId, userId) {
  console.log(nodes.getIn([nodeId, 'childIds']))
  return nodes.getIn([nodeId, 'childIds']).reduce((acc, childId) => {
    const parentId = nodes.getIn([childId, 'parentId'])
    if (parentId !== startNodeId && nodes.getIn([parentId, 'collapsedBy', userId])) {
      return acc
    }

    // the nodes parent is uncollapsed so continue diving deeper into the tree accumulating
    return [ ...acc, childId, ...getVisibleNodesIfNodeWasExpanded(startNodeId, nodes, childId, userId) ]
  }, [])
}

export function getCurrentlySelectedNodeIds (nodes) {
  return nodes.filter(n => n.get('selected')).map(n => n.get('id')).toList()
}

export function getCurrentlyFocusedNodeId (nodes) {
  let focusedNode = nodes.find(n => n.get('focused') || n.get('notesFocused'))
  return focusedNode ? focusedNode.get('id') : null
}

export function getNodeCount (state) {
  return state.tree.filter(node => !node.deleted).count()
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

export const getNodeProps = (state, id) => {
  const tree = currentTreeState(state)
  const nodeFromState = tree.get(id)
  const parentId = nodeFromState.get('parentId')
  const parentNode = parentId ? tree.get(parentId) : undefined
  const parentNodeChildIds = parentId ? parentNode.get('childIds') : []
  const rootNodeId = getRootNodeId(state)

  let positionInOrderedList
  if (parentNode && parentNode.displayMode === 'ordered') {
    positionInOrderedList = parentNodeChildIds.indexOf(id) + 1
  }

  return {
    rootNodeId,
    nodeInitialized: !!nodeFromState,
    auth: state.auth,
    positionInOrderedList,
    lastChild: parentNode && parentNodeChildIds.indexOf(id) === parentNodeChildIds.length - 1,
    visible: state.visibleNodes.get(id),
    ...nodeFromState.toJS()
  }
}
