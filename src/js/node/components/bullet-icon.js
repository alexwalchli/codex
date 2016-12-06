import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import * as nodeSelectors from '../node-selectors'

export class BulletIcon extends Component {

  onBulletClick () {
    const { nodeId, toggleNodeExpansion, focusNode } = this.props
    toggleNodeExpansion(nodeId)
    focusNode(nodeId)
  }

  render () {
    const { nodeCount } = this.props

    return (
      <div className='bullet-container' onClick={(e) => this.onBulletClick(e)}>
        { nodeCount === 2
          ? <div className='pulse' />
          : null }
        <div className='unordered-bullet'><div className='outer-circle' /><div className='inner-circle' /></div> }
      </div>
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  return {
    nodeCount: nodeSelectors.getNodeCount(state),
    ...ownProps
  }
}

const ConnectedBulletIcon = connect(mapStateToProps, actionCreators)(BulletIcon)
export default ConnectedBulletIcon
