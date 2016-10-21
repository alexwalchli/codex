export default function createUserPage (id, rootNodeId, createdById, title = 'New Page', isHome = false) {
  return {
    id,
    rootNodeId: rootNodeId,
    createdById,
    title: title,
    isHome
  }
}
