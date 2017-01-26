import React, { Component } from 'react'
import { connect } from 'react-redux'
import Node from '../../node/components/node'
import AppContextMenu from './app-context-menu'
// import AppSubscriptions from './app-subscriptions'
import SignIn from '../../auth/components/sign-in'
import AppLoader from './app-loader'
import TopBar from './top-bar'
import * as appSelectors from '../app-selectors'
import * as nodeActionCreators from '../../node/node-action-creators'

export class App extends Component {

  onClick (e) {
    const { closeAllNodeMenus } = this.props
    closeAllNodeMenus()
  }

  render () {
    const { appState, currentUserPage, isAuthenticated, initialAuthChecked, typeScale } = this.props
    let appIsInitialized = isAuthenticated && currentUserPage && appState.tree.present.get(currentUserPage.get('rootNodeId'))
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
            <TopBar />
            <AppContextMenu />

            <div id='tree-container'>
              <Node id={currentUserPage.get('rootNodeId')} />
            </div>
          </div>
          : null }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return appSelectors.getAppProps(state, ownProps)
}

const ConnectedApp = connect(mapStateToProps, nodeActionCreators)(App)
export default ConnectedApp

// TODO: Reimplement
// <a className={pagesSidePanelCss} onClick={togglePagesSidePanel} ><i className='icon dripicons-menu' /></a>
//  { pagesSidePanelVisible
                // ? <PagesSidePanel />
                // : null }
