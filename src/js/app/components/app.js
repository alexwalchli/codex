import React, { Component } from 'react'
import { connect } from 'react-redux'
import Node from '../../node/components/node'
import AppContextMenu from './app-context-menu'
import SignIn from '../../auth/components/sign-in'
import AppLoader from './app-loader'
import * as appSelectors from '../app-selectors'

export class App extends Component {

  onClick (e) {
    // const { closeAllMenusAndDeselectAllNodes } = this.props
    // closeAllMenusAndDeselectAllNodes()
  }

  render () {
    const { appState, currentUserPage, isAuthenticated, initialAuthChecked } = this.props
    let appIsInitialized = isAuthenticated && currentUserPage && appState.tree.get(currentUserPage.get('rootNodeId'))
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
              <Node id={currentUserPage.get('rootNodeId')} />
            </div>

          </div>
          : null }
      </div>
    )
  }
}

const ConnectedApp = connect((state, ownProps) => appSelectors.getAppProps(state, ownProps))(App)
export default ConnectedApp

// TODO: Reimplement
// <a className={pagesSidePanelCss} onClick={togglePagesSidePanel} ><i className='icon dripicons-menu' /></a>
//  { pagesSidePanelVisible
                // ? <PagesSidePanel />
                // : null }
