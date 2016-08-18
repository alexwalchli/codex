import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import Node from '../containers/node';
import Topbar from './top-bar';
import AppContextMenu from '../containers/app-context-menu';
import * as authActions from '../actions/auth';

export class SignIn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { signInWithGithub, signInWithGoogle, signInWithTwitter } = this.props;
        
        return (
        <div className="g-row sign-in">
            <div className="g-col">
                <h1 className="sign-in__heading">Sign in</h1>
                <button className="btn sign-in__button" onClick={signInWithGithub} type="button">GitHub</button>
                <button className="btn sign-in__button" onClick={signInWithGoogle} type="button">Google</button>
                <button className="btn sign-in__button" onClick={signInWithTwitter} type="button">Twitter</button>
            </div>
        </div>
    );
    }
}

function mapStateToProps(state, ownProps) {
    return state;
}

const ConnectedSignIn = connect(mapStateToProps, authActions)(SignIn)
export default ConnectedSignIn