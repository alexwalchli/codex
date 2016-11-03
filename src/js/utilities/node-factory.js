export default function createNode (id, parentId, childIds, content, createdById) {
  return {
    id,
    parentId,
    childIds: childIds || [],
    content: content || '',
    createdById,
    visible: true,
    collapsedBy: {}
  }
}
