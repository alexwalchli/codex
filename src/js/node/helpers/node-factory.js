export const nodeFactory = (id, parentId, childIds, content, createdById) => ({
  id,
  parentId,
  childIds: childIds || [],
  content: content || '',
  createdById,
  visible: true,
  collapsedBy: {},
  taggedByIds: []
})
