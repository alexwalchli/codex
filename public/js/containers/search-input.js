import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

export class SearchInput extends Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e){
        const { searchNodes } = this.props;
        searchNodes(this.refs.searchInput.value);
    }

    render() {
        return (
            <input className="search" ref="searchInput" onChange={this.handleInputChange} />
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {...state, ...ownProps };
}

const ConnectedSearchInput = connect(mapStateToProps, actions)(SearchInput)
export default ConnectedSearchInput