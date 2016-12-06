
export const currentPage = (state) => {
  const currentUserPageId = state.app.get('currentUserPageId')
  return state.userPages.get(currentUserPageId)
}
