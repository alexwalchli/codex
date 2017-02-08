import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import * as nodeSelectors from '../node-selectors'

export class BulletMenu extends Component {

  onCompleteClick (e) {
    const { nodeId, toggleNodeComplete, toggleNodeMenu } = this.props
    e.stopPropagation()
    toggleNodeComplete(nodeId)
    toggleNodeMenu(nodeId)
  }

  onDeleteClick (e) {
    const { nodeId, deleteNode } = this.props
    e.stopPropagation()
    deleteNode(nodeId)
  }

  onAddNoteClick (e) {
    const {nodeId, toggleNodeMenu, focusNode} = this.props
    e.stopPropagation()
    toggleNodeMenu(nodeId)
    focusNode(nodeId, true)
  }

  render () {
    const { nodeId, completed, toggleNodeMenu } = this.props

    return (
      <div className='bullet-menu' onMouseLeave={() => toggleNodeMenu(nodeId)}>
        <ul>
          <li onClick={(e) => this.onAddNoteClick(e)}><i className='icon dripicons-document' />Add note</li>
          <li onClick={(e) => this.onCompleteClick(e)}><i className='icon dripicons-checkmark' />
            { completed
              ? 'Re-open'
              : 'Complete' }
          </li>
          <li onClick={(e) => this.onDeleteClick(e)}><i className='icon dripicons-cross' />Delete</li>
        </ul>
      </div>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return {
    ...ownProps,
    ...nodeSelectors.getNodeProps(state, ownProps.nodeId)
  }
}

const ConnectedBulletMenu = connect(mapStateToProps, actionCreators)(BulletMenu)
export default ConnectedBulletMenu
