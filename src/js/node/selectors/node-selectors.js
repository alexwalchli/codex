export function dictionaryToArray (dictionary) {
  if (!dictionary) {
    return null
  }
  return Object.keys(dictionary).map(key => dictionary[key])
}

// retrieves the current state of nodes
export function getPresentNodes (appState) {
  let presentNodes = Object.assign({}, appState.tree.present)

  Object.keys(presentNodes).forEach(nodeId => {
    if (presentNodes[nodeId].deleted) {
      delete presentNodes[nodeId]
    }
  })

  return presentNodes
}

// retrieves the root node ID of the current page
export function getRootNodeId (appState) {
  let currentUserPageId = appState.app.currentUserPageId
  return dictionaryToArray(appState.userPages).find(up => up.id === currentUserPageId).rootNodeId
}

// retrieves a flattened ordered list of all node IDs starting under startNodeId
export function getAllNodeIdsOrdered (nodes, startNodeId) {
  let allOrderedChildIds = getAllDescendantIds(nodes, startNodeId)
  return [ startNodeId, ...allOrderedChildIds ]
}

// recursively retrieves, and flattens, all node IDs under the startNodeId
export function getAllDescendantIds (nodes, startNodeId) {
  return nodes[startNodeId].childIds.reduce((acc, childId) => {
    if (!nodes[childId].deleted) {
      return [ ...acc, childId, ...getAllDescendantIds(nodes, childId) ]
    }
    return acc
  }, [])
}

// recursively retrieves, and flattens, all node Ids excluding children of collapsed nodes, except children of the start node
export function getAllUncollapsedDescedantIds (rootNodeId, nodes, startNodeId, userId) {
  return nodes[startNodeId].childIds.reduce((acc, childId) => {
    if (rootNodeId !== startNodeId && !nodes[nodes[childId].parentId].collapsedBy[userId]) {
      return acc
    }
    return [ ...acc, childId, ...getAllUncollapsedDescedantIds(rootNodeId, nodes, childId) ]
  }, [])
}

export function getCurrentlySelectedNodeIds (nodes) {
  return dictionaryToArray(nodes).filter(n => n.selected).map(n => n.id)
}

export function getCurrentlyFocusedNodeId (nodes) {
  let focusedNode = dictionaryToArray(nodes).find(n => n.focused || n.notesFocused)
  return focusedNode ? focusedNode.id : null
}

// retrieves the next node above or below that is visible
export function getNextNodeThatIsVisible (rootNodeId, nodes, visibleNodes, currentNodeId, searchAbove = true) {
  const allNodeIdsOrdered = getAllNodeIdsOrdered(nodes, rootNodeId)
  const currentNodeIndex = allNodeIdsOrdered.indexOf(currentNodeId)

  if (searchAbove) {
    for (let j = currentNodeIndex - 1; j > 0; j--) {
      let node = nodes[allNodeIdsOrdered[j]]
      if (visibleNodes[node.id]) {
        return node
      }
    }
  } else {
    for (let k = currentNodeIndex + 1; k < allNodeIdsOrdered.length; k++) {
      let node = nodes[allNodeIdsOrdered[k]]
      if (visibleNodes[node.id]) {
        return node
      }
    }
  }

  return null
}

export const getNodeDataForComponent = (state, id, parentId) => {
  const nodeFromState = state.tree.present[id]
  const parentNode = state.tree.present[parentId]

  let positionInOrderedList
  if (parentNode && parentNode.displayMode === 'ordered') {
    positionInOrderedList = parentNode.childIds.indexOf(id) + 1
  }

  return { nodeInitialized: !!nodeFromState, auth: state.auth, positionInOrderedList, visible: state.visibleNodes.present[id], ...nodeFromState }
}
