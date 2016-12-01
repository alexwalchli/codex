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

export class App extends Component {

  onClick (e) {
    // const { closeAllMenusAndDeselectAllNodes } = this.props
    // closeAllMenusAndDeselectAllNodes()
  }

  render () {
    let currentUserPage = userPagesList(this.props.userPages).filter(u => u.id === this.props.app.currentUserPageId)[0]
    let appIsInitialized = isAuthenticated(this.props) && currentUserPage && this.props.tree.present[currentUserPage.rootNodeId]
    let userIsAuthenticated = isAuthenticated(this.props)
    let showSignIn = !userIsAuthenticated && this.props.auth.initialCheck
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
  return Object.assign({}, { ...state, ...ownProps })
}

function userPagesList (userPages) {
  return Object.keys(userPages).map(userPageId => userPages[userPageId])
}

const ConnectedApp = connect(mapStateToProps, {...appActionCreators, ...nodeActionCreators, ...nodeActions})(App)
export default ConnectedApp

// TODO: Reimplement
// <a className={pagesSidePanelCss} onClick={togglePagesSidePanel} ><i className='icon dripicons-menu' /></a>
//  { pagesSidePanelVisible
                // ? <PagesSidePanel />
                // : null }
