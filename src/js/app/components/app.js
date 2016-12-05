import React, { Component } from 'react'
import { connect } from 'react-redux'
import Node from '../../node/components/node'
import AppContextMenu from './app-context-menu'
import SignIn from '../../auth/components/sign-in'
import AppLoader from './app-loader'
import { isAuthenticated } from '../../auth/helpers/index'
import * as appActionCreators from '../actions/app-action-creators'
import * as nodeActionCreators from '../../node/actions/node-action-creators'
import * as nodeActions from '../../node/actions/node-actions'
import * as userPageSelectors from '../../userpage/selectors/userpage-selectors'
import * as nodeSelectors from '../../node/selectors/node-selectors'

export class App extends Component {

  onClick (e) {
    // const { closeAllMenusAndDeselectAllNodes } = this.props
    // closeAllMenusAndDeselectAllNodes()
  }

  render () {
    const { currentUserPage, tree, isAuthenticated, initialAuthChecked } = this.props
    let appIsInitialized = isAuthenticated && currentUserPage && tree[currentUserPage.rootNodeId]
    let userIsAuthenticated = isAuthenticated
    let showSignIn = !userIsAuthenticated && initialAuthChecked
    let showLoading = userIsAuthenticated && !appIsInitialized

    return (
      <div id='app' onClick={(e) => this.onClick(e)}>
        { showSignIn
          ? <SignIn />
          : null }

        { showLoading
          ? <AppLoader />
          : null }

        { appIsInitialized
          ? <div id='signed-in'>
            <AppContextMenu />

            <div id='tree-container'>
              <Node id={currentUserPage.rootNodeId} />
            </div>

          </div>
          : null }
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    currentUserPage: userPageSelectors.currentPage(state),
    isAuthenticated: isAuthenticated(state),
    initialAuthChecked: state.getIn(['auth', 'initialCheck']),
    tree: nodeSelectors.currentTreeState(state).toJS(),
    ...ownProps
  }
}

const ConnectedApp = connect(mapStateToProps, {...appActionCreators, ...nodeActionCreators, ...nodeActions})(App)
export default ConnectedApp

// TODO: Reimplement
// <a className={pagesSidePanelCss} onClick={togglePagesSidePanel} ><i className='icon dripicons-menu' /></a>
//  { pagesSidePanelVisible
                // ? <PagesSidePanel />
                // : null }
