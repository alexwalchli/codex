export function dictionaryToArray(dictionary){
  if(!dictionary){
    return null;
  }
  return Object.keys(dictionary).map(key => dictionary[key]);
}

// retrieves the current state of nodes
export function getPresentNodes(appState){
  let presentNodes = Object.assign({}, appState.tree.present);

  Object.keys(presentNodes).forEach(nodeId => {
    if(presentNodes[nodeId].deleted){
        delete presentNodes[nodeId];
    }
  });

  return presentNodes;
}

// retrieves the root node ID of the current page
export function getRootNodeId(appState){
  let currentUserPageId = appState.app.currentUserPageId;
  return dictionaryToArray(appState.userPages).find(up => up.id === currentUserPageId).rootNodeId;
}

// retrieves a flattened ordered list of all node IDs starting under startNodeId
export function getAllNodeIdsOrdered(nodes, startNodeId){
  let allOrderedChildIds = getAllDescendantIds(nodes, startNodeId);
  return [ startNodeId, ...allOrderedChildIds ];
}

// recursively retrieves, and flattens, all node IDs under the startNodeId
export function getAllDescendantIds(nodes, startNodeId) {
  return nodes[startNodeId].childIds.reduce((acc, childId) => (
    [ ...acc, childId, ...getAllDescendantIds(nodes, childId) ]
  ), []);
}

// recursively retrieves, and flattens, all node Ids excluding children of collapsed nodes, except children of the start node
export function getAllUncollapsedDescedantIds(rootNodeId, nodes, startNodeId) {
  return nodes[startNodeId].childIds.reduce((acc, childId) => {
    if(rootNodeId !== startNodeId && nodes[nodes[childId].parentId].collapsed){
      return acc;
    }
    return [ ...acc, childId, ...getAllUncollapsedDescedantIds(rootNodeId, nodes, childId) ];
  }, []);
}

export function getCurrentlySelectedNodeIds(nodes){
  return dictionaryToArray(nodes).filter(n => n.selected).map(n => n.id);
}

export function getCurrentlyFocusedNodeId(nodes){
  let focusedNode = dictionaryToArray(nodes).find(n => n.focused || n.notesFocused);
  return focusedNode ? focusedNode.id : null;
}

// retrieves the silbing node directly above the nodeId
export function getSiblingNodeAbove(nodes, nodeId, parentId){
  var parentNode = nodes[parentId];
  var siblingNodeAboveId = parentNode.childIds[parentNode.childIds.indexOf(nodeId) - 1];

  return nodes[siblingNodeAboveId];
}

// retrieves the next node above or below that is visible
export function getNextNodeThatIsVisible(rootNodeId, nodes, currentNodeId, searchAbove = true){
  let allNodeIdsOrdered = getAllNodeIdsOrdered(nodes, rootNodeId);
  let currentNodeIndex = allNodeIdsOrdered.indexOf(currentNodeId);
  let bound = searchAbove ? 0 : nodes.length;

  if(searchAbove){
    for(let j = currentNodeIndex - 1; j > 0; j--){
      let node = nodes[allNodeIdsOrdered[j]];
      if(node.visible){
        return node;
      }
    }
  } else {
    for(let k = currentNodeIndex + 1; k < allNodeIdsOrdered.length; k++){
      let node = nodes[allNodeIdsOrdered[k]];
      if(node.visible){
        return node;
      }
    }
  }

  return null;
}