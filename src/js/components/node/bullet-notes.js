import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/node'

export class BulletNotes extends Component {
  constructor(props){
    super(props)

    this.state = {
      notes: props.notes
    }
  }

  onBlur (e) {
    const { nodeId, updateNodeNotes } = this.props
    const notes = this.refs.notesInput.value
    updateNodeNotes(nodeId, notes)
  }

  onKeyDown (e) {
    const { nodeId, focusNode, focusNodeBelow } = this.props
    if (e.key === 'Enter') {
      e.stopPropagation()
    } else if (e.key === 'Backspace' && !this.refs.notesInput.value) {
      e.stopPropagation()
      this.setState({
        editingNotes: false
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusNodeBelow(nodeId)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusNode(nodeId)
    } else {
      this.setState({
        editingNotes: true
      })
    }
  }

  onClick (e) {
    const { nodeId, focusNode } = this.props
    focusNode(nodeId, true)
  }

  render () {
    const { currentlyEditing, notes } = this.props

    let notesCssClasses = 'notes'
    if (!notes && !currentlyEditing) {
      notesCssClasses += ' hidden'
    }

    return (
      <div className={notesCssClasses}>
        <textarea ref='notesInput'
          defaultValue={notes}
          onBlur={(e) => this.onBlur(e)}
          onKeyDown={(e) => this.onKeyDown(e)}
          onClick={(e) => this.onClick(e)} />
      </div>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletNotes = connect(mapStateToProps, actions)(BulletNotes)
export default ConnectedBulletNotes
