import _ from 'lodash'

export default function treeDiffer (nodesA, nodesB) {
  let difference = { added: [], deleted: [], modified: [] }
  let nodeIdsToCheckAsNew = Object.keys(nodesB)

  Object.keys(nodesA).forEach(nodeAId => {
    let nodeB = nodesB[nodeAId]
    let nodeA = nodesA[nodeAId]
    if (nodeB && (nodeB.content !== nodeA.content || !_.isEqual(nodeB.childIds, nodeA.childIds))) {
      difference.modified.push(nodeAId)
      delete nodeIdsToCheckAsNew[nodeAId]
    } else if (!nodeB) {
      difference.deleted.push(nodeAId)
    }
  })

  nodeIdsToCheckAsNew.forEach(nodeId => {
    if (!nodesA[nodeId]) {
      difference.added.push(nodeId)
    }
  })

  return difference
}
