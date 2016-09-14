import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import SearchInput from '../containers/search-input';

export class Topbar extends Component {
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
                    <ul className="menu">
                        <li><a><i className="icon dripicons-user-group"></i></a></li>
                        <li><a><i className="icon dripicons-archive"></i></a></li>
                        <li><a><i className="icon dripicons-user"></i></a></li>
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