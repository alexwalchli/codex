import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../actions/node-action-creators'
import Textarea from 'react-textarea-autosize'
import renderContent from '../helpers/render-content'

export class BulletNotes extends Component {
  constructor (props) {
    super(props)

    this.state = {
      notes: props.notes
    }
  }

  componentDidUpdate () {
    const { notesFocused } = this.props
    if (notesFocused) {
      this.refs.notesInput.focus()
    }
  }

  componentWillMount () {
    const { notes } = this.props
    this.setState({
      renderedNotes: renderContent(notes).payload
    })
  }

  componentWillReceiveProps (newProps) {
    if (newProps.notes !== this.props.notes) {
      this.setState({
        renderedNotes: renderContent(newProps.notes).payload
      })
    }
  }

  onBlur (e) {
    const { nodeId, updateNodeNotes } = this.props
    const notes = this.refs.notesInput.value
    updateNodeNotes(nodeId, notes)
    this.setState({
      editingNotes: false
    })
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

  getHtmlNotes () {
    return { __html: this.state.renderedNotes }
  }

  render () {
    const { notes, notesFocused } = this.props
    const { editingNotes } = this.state

    let notesCssClasses = 'notes'
    if (!notes && !editingNotes && !notesFocused) {
      notesCssClasses += ' hidden'
    }

    return (
      <div className={notesCssClasses} onClick={(e) => this.onClick(e)}>
        { editingNotes || notesFocused
          ? <Textarea ref='notesInput'
            defaultValue={notes}
            onBlur={(e) => this.onBlur(e)}
            onKeyDown={(e) => this.onKeyDown(e)} />
          : <div dangerouslySetInnerHTML={this.getHtmlNotes()} />}
      </div>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletNotes = connect(mapStateToProps, actionCreators)(BulletNotes)
export default ConnectedBulletNotes