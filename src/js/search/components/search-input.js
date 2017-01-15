import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../search-action-creators'

export class SearchInput extends Component {

  onInputChange () {
    const { searchNodes } = this.props
    searchNodes(this.refs.searchInput.value)
  }

  onInputClick (e) {
    e.stopPropagation()
    const { searchFocus } = this.props
    searchFocus()
  }

  render () {
    return (
      <div className='search'>
        <div className='icon dripicons-search' />
        <div className='icon dripicons-tags' />
        <input ref='searchInput' onFocus={(e) => this.onInputClick(e)} onChange={() => this.onInputChange()} />
      </div>
    )
  }
}

function mapStateToProps (ownProps) {
  return ownProps
}

const ConnectedSearchInput = connect(mapStateToProps, actions)(SearchInput)
export default ConnectedSearchInput
