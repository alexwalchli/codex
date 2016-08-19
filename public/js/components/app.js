import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/node';
import Node from '../containers/node';
import Topbar from './top-bar';
import AppContextMenu from '../containers/app-context-menu';
import SignIn from './sign-in';
import AppLoader from './app-loader';
import { isAuthenticated } from '../auth';

export class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let currentUserPage = userPagesList(this.props.userPages).filter(u => u.isHome)[0];
        let appIsInitialized = isAuthenticated(this.props) && currentUserPage && this.props.tree.present[currentUserPage.rootNodeId];
        let userIsAuthenticated = isAuthenticated(this.props);
        let showSignIn = !userIsAuthenticated && this.props.auth.initialCheck;
        let showLoading = userIsAuthenticated && !appIsInitialized;

        console.log('userIsAuthenticated ' + userIsAuthenticated);
        console.log('appIsInitialized ' + appIsInitialized);
        console.log('initialCheck ' + this.props.initialCheck);

        return (
            <div id="app">
                { showSignIn ? 
                    <SignIn />
                    : null    
                }

                { showLoading ? 
                    <AppLoader />
                : null }

                { appIsInitialized ?
                    <div id="signed-in">
                        <Topbar />
                        <AppContextMenu />
                        <div id="tree-container">
                            <Node id={currentUserPage.rootNodeId} />
                        </div>  
                    </div>  
                    :
                    null
                }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state;
}

function userPagesList(userPages){
    return Object.keys(userPages).map(userPageId => userPages[userPageId]);
}

const ConnectedApp = connect(mapStateToProps, actions)(App)
export default ConnectedApp