export function dictionaryToArray(dictionary){
    return Object.keys(dictionary).map(key => dictionary[key]);
}

// retrieves the current state of nodes
export function getPresentNodes(appState){
    return appState.tree.present;
}

// retrieves the root node ID of the current page
export function getRootNodeId(appState){
    // TODO: get current userPage
    return dictionaryToArray(appState.userPages).find(up => up.isHome).rootNodeId;
}

// retrieves a node's index in the full, flattened, tree
export function getNodeIndex(appState, nodeId){
    const rootNodeId = getRootNodeId(appState);
    return getAllNodeIdsOrdered(nodes, rootNodeId).indexOf(nodeId);
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

// recursively retrieves, and flattens, all node Ids excluding children of collapsed nodes
export function getAllUncollapsedDescedantIds(nodes, startNodeId) {
    return nodes[startNodeId].childIds.reduce((acc, childId) => {
        if(nodes[nodes[childId].parentId].collapsed){
            return acc;
        }
        return [ ...acc, childId, ...getAllUncollapsedDescedantIds(nodes, childId) ];
    }, []);
}

export function getCurrentlySelectedNodeIds(nodes){
    return dictionaryToArray(nodes).filter(n => n.selected).map(n => n.id);
}

export function getCurrentlyFocusedNodeId(nodes){
    let focusedNode = dictionaryToArray(nodes).find(n => n.focused);
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