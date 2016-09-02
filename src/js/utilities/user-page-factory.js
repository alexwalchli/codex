export default function createUserPage(id, rootNodeId, createdById, allDescendantIds, title = 'New Page', isHome = false){
    return {
        id,
        rootNodeId: rootNodeId,
        createdById,
        allDescendantIds,
        title: title,
        isHome: false
    };
}