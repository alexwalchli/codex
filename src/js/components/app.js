import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Node from '../containers/node';
import * as actions from '../actions';
import PagesSidePanel from '../containers/pages-side-panel';
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
        const { togglePagesSidePanel } = this.props;
        const { pagesSidePanelVisible } = this.props.app;
        let currentUserPage = userPagesList(this.props.userPages).filter(u => u.id === this.props.app.currentUserPageId)[0];
        let appIsInitialized = isAuthenticated(this.props) && currentUserPage && this.props.tree.present[currentUserPage.rootNodeId];
        let userIsAuthenticated = isAuthenticated(this.props);
        let showSignIn = !userIsAuthenticated && this.props.auth.initialCheck;
        let showLoading = userIsAuthenticated && !appIsInitialized;

        let toggledCss = pagesSidePanelVisible ? `toggled` : null;
        let pagesSidePanelCss = `side-panel-toggle ${toggledCss}`;

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
                        <a className={pagesSidePanelCss} onClick={togglePagesSidePanel} ><i className="icon dripicons-menu"></i></a>
                        <Topbar />
                        
                        <AppContextMenu />
                        
                        { pagesSidePanelVisible ?
                        <PagesSidePanel />
                        : null }
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
    return Object.assign({}, state);
}

function userPagesList(userPages){
    return Object.keys(userPages).map(userPageId => userPages[userPageId]);
}

const ConnectedApp = connect(mapStateToProps, actions)(App)
export default ConnectedApp