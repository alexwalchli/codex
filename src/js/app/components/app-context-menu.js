import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../node/actions/node-actions'
import * as nodeSelectors from '../../node/selectors/node-selectors'

export class AppContextMenu extends Component {

  onDeleteClick (e) {
    const { deleteNodes, nodes } = this.props
    e.stopPropagation()
    deleteNodes(nodes.filter(item => item.selected).map(node => node.id))
  }

  onCompleteClick (e) {
    const { completeNodes, nodes } = this.props
    e.stopPropagation()
    completeNodes(nodes.filter(item => item.selected).map(node => node.id))
  }

  render () {
    const { nodes } = this.props
    var itemsSelected = nodes.filter(item => item.selected)
    var cssClasses = ''
    if (!itemsSelected.length) {
      cssClasses = 'hidden'
    }

    return (
      <div id='app-context-menu' className={cssClasses}>
        <button onClick={(e) => this.onDeleteClick(e)}>Delete</button> or <button onClick={(e) => this.onCompleteClick(e)}>Complete</button> {itemsSelected.length} items
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  const tree = nodeSelectors.currentTreeState(state).toJS()
  return {
    nodes: Object.keys(tree).map(nodeId => tree[nodeId]),
    ...ownProps
  }
}

const ConnectedAppContextMenu = connect(mapStateToProps, actions)(AppContextMenu)
export default ConnectedAppContextMenu
