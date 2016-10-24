import React, { Component } from 'react'
import * as actions from '../../actions/node'
import { connect } from 'react-redux'

export class BulletIcon extends Component {

  onBulletClick () {
    const { nodeId, toggleNodeExpansion, focusNode } = this.props
    toggleNodeExpansion(nodeId)
    focusNode(nodeId)
  }

  render () {
    const { positionInOrderedList } = this.props

    return (
      <div className='bullet-container' onClick={(e) => this.onBulletClick(e)}>
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
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletIcon = connect(mapStateToProps, actions)(BulletIcon)
export default ConnectedBulletIcon
