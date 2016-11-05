import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'

export class Highlighter extends Component {

  render () {
    const { value } = this.props
    // let valueWithHighlights = value

    return (
      <div className='highlighter'>
        <span>{value}</span>
        <span className='caret' style={{ width: '10px', backgroundColor: 'red' }} ref='caret'>C</span>
      </div>
    )
  }

}

// react redux

function mapStateToProps (state, ownProps) {
  return {
    // tags: state.tree.present[ownProps.nodeId].tags,
    ...ownProps
  }
}

const ConnectedHighlighter = connect(mapStateToProps, actions)(Highlighter)
export default ConnectedHighlighter
