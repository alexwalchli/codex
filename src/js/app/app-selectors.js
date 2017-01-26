import * as userPageSelectors from '../userpage/userpage-selectors'
import * as authSelectors from '../auth/auth-selectors'

export const getAppProps = (state, ownProps) => {
  return {
    ...ownProps,
    appState: state,
    currentUserPage: userPageSelectors.currentPage(state),
    isAuthenticated: authSelectors.isAuthenticated(state),
    initialAuthChecked: state.auth.get('initialCheck'),
    typeScale: state.userPreferences.get('typeScale')
  }
}
