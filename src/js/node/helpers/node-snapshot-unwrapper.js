const unwrap = (nodeSnapshot) => {
  // firebase does not store empty arrays or objects, so initialize as empty if they are undefined

  let node = nodeSnapshot.val()
  node.childIds = node.childIds || []
  node.collapsedBy = node.collapsedBy || {}
  node.taggedByIds = node.taggedByIds || []

  return node
}

export default unwrap
