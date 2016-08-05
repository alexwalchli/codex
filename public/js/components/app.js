import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/node';
import Node from '../containers/node';
import Topbar from './top-bar';
import AppContextMenu from '../containers/app-context-menu';
import SignIn from './sign-in';
import { isAuthenticated } from '../auth';

export class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div id="app">
                { isAuthenticated(this.props) ?
                    <div id="signed-in">
                        <Topbar />
                        <AppContextMenu />
                        <div id="tree-container">
                            <Node id={'0'} />
                        </div>  
                    </div>  
                    :
                    <SignIn />
                }
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state;
}

const ConnectedApp = connect(mapStateToProps, actions)(App)
export default ConnectedApp