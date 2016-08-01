import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import SearchInput from '../containers/search-input';

export default class Topbar extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
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
                        <li><a>Clean Up</a></li>
                        <li><a>Alex Walchli</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return state;
}