export const userPageFactory = (id, rootNodeId, createdById, title = 'New Page', isHome = false) => ({
  id,
  rootNodeId: rootNodeId,
  createdById,
  title: title,
  isHome
})
