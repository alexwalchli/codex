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
                <div className="sign-in-logo">codex</div>
                <a className="btn-sign-in btn-google" onClick={signInWithGoogle}>
                    <span className="fa fa-google"></span>
                    Sign in with Google
                </a>
                <a className="btn-sign-in btn-twitter" onClick={signInWithTwitter}>
                    <span className="fa fa-twitter"></span>
                    Sign in with Twitter
                </a>
                <a className="btn-sign-in btn-github" onClick={signInWithGithub}>
                    <span className="fa fa-github"></span>
                    Sign in with GitHub
                </a>
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