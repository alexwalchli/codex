import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchInput from '../containers/search-input';

export default class Topbar extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const { signOut, auth } = this.props;
        return (
            <nav className="top-bar clearfix">
                <div className="top-bar-left">
                    <ul>
                        <li><span className="logo">codex</span></li>
                        <li><SearchInput /></li>
                    </ul>
                </div>
                <div className="top-bar-right">
                    <ul>
                        <li><a>{ auth.displayName }</a></li>
                        <li><a onClick={signOut}>Sign Out</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state;
}

const ConnectedTopbar = connect(mapStateToProps, actions)(Topbar)
export default ConnectedTopbar