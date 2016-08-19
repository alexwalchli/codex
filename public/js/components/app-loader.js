import React from 'react';
import { Component } from 'react';

export default class AppLoader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className="app-loader">
            Loading...
        </div>
    );
    }
}