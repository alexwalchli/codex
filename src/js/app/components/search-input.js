import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/node'

export class SearchInput extends Component {
  constructor (props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    const { searchNodes } = this.props
    searchNodes(this.refs.searchInput.value)
  }

  render () {
    return (
      <div className='search'>
        <div className='icon dripicons-search' />
        <div className='icon dripicons-tags' />
        <input ref='searchInput' onChange={this.handleInputChange} />
      </div>
        )
  }
}

function mapStateToProps (state, ownProps) {
  return { ...state, ...ownProps }
}

const ConnectedSearchInput = connect(mapStateToProps, actions)(SearchInput)
export default ConnectedSearchInput
