
export const currentPage = (state) => {
  return state.userPages.get(currentPageId(state))
}

export const currentPageId = (state) => {
  return state.app.get('currentUserPageId')
}
