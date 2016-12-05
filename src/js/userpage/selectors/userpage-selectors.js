
export const currentPage = (state) => {
  const currentUserPageId = state.getIn(['app', 'currentUserPageId'])
  return state.getIn(['userPages', currentUserPageId])
}
