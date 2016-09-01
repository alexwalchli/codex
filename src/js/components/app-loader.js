import React from 'react';
import { Component } from 'react';

export default class AppLoader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className="app-loader">
            <div className="spinner-container"><i className="icon dripicons-loading spinner"></i></div>&nbsp;&nbsp;Loading...
        </div>
    );
    }
}