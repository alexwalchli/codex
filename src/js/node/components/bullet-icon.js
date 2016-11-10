import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions/node-action-creators'

export class BulletIcon extends Component {

  onBulletClick () {
    const { nodeId, toggleNodeExpansion, focusNode } = this.props
    toggleNodeExpansion(nodeId)
    focusNode(nodeId)
  }

  render () {
    const { positionInOrderedList, nodeCount } = this.props

    return (
      <div className='bullet-container' onClick={(e) => this.onBulletClick(e)}>
        { nodeCount === 2
          ? <div className='pulse' />
          : null }
        { positionInOrderedList
          ? <div className='ordered-bullet'>
            <div className='outer-circle' />
            <div className='number'>{positionInOrderedList}.</div>
          </div>
          : <div className='unordered-bullet'><div className='outer-circle' /><div className='inner-circle' /></div> }
      </div>
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  return { nodeCount: Object.keys(state.tree.present).length, ...state.tree.present[ownProps.nodeId] }
}

const ConnectedBulletIcon = connect(mapStateToProps, actionCreators)(BulletIcon)
export default ConnectedBulletIcon