import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import * as nodeSelectors from '../node-selectors'

export class BulletIcon extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dragging: false
    }
  }

  onBulletClick () {
    const { nodeId, toggleNodeExpansion, focusNode } = this.props
    toggleNodeExpansion(nodeId)
    focusNode(nodeId)
  }

  onDragStart (e) {
    const { onDragStart } = this.props
    this.setState({ dragging: true })
    onDragStart(e)
  }

  onDragStop (e) {
    this.setState({ dragging: false })
  }

  render () {
    const { nodeCount } = this.props
    const { dragging } = this.state
    const className = 'bullet-container' + (dragging ? ' dragging' : '')
    return (
      <div onDragStart={(e) => this.onDragStart(e)} draggable className={className} onClick={(e) => this.onBulletClick(e)}>
        { nodeCount === 2
          ? <div className='pulse' />
          : null }
        <div className='unordered-bullet'><div className='outer-circle' /><div className='inner-circle' /></div>
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
