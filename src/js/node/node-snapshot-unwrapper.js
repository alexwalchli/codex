import * as I from 'immutable'
import { NodeRecord } from './node-record'

const nodeSnapshotUnwrapper = (nodeSnapshot) => {
  // firebase does not store empty arrays or objects, so initialize as empty if they are undefined
  // and convert to ImmutableJS equivalents
  let nodeData = nodeSnapshot.val()
  nodeData.childIds = I.List(nodeData.childIds)
  nodeData.taggedByIds = I.Map(nodeData.taggedByIds)
  nodeData.collapsedBy = I.Map(nodeData.collapsedBy)
  return new NodeRecord(nodeData)
}

export default nodeSnapshotUnwrapper
