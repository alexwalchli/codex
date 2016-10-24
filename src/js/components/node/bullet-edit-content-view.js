import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/node'
import MentionsInput from '../intellisense/mentionsinput'
import Mention from '../intellisense/mention'
import defaultStyle from '../intellisense/mentionStyle'
import defaultMentionStyle from '../intellisense/defaultMentionStyle'

export class BulletEditContentView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      content: props.content
    }
  }

  // event handling

  onChange (e, value) {
    this.setState({
      content: value
    })
  }

  onBlur (e) {
    this.submitContent()
  }

  onKeyDown (e) {
    const { nodeId, createNode, deleteNode, focusNodeAbove, undo, redo,
            focusNodeBelow, parentId, demoteNode, promoteNode } = this.props
    e.stopPropagation()

    if (e.key === 'Tab' && e.shiftKey) {
      e.preventDefault()
      this.submitContent()
      promoteNode(nodeId, parentId)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      this.submitContent()
      demoteNode(nodeId, parentId)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      this.submitContent()
      // if cursor is add the beginning of the input, add new node at current position, else below
      const offset = e.target.selectionEnd === 0 && e.target.value ? 0 : 1
      createNode(nodeId, offset, '')
    } else if (e.key === 'Backspace' && !this.state.content) {
      e.preventDefault()
      focusNodeAbove(nodeId)
      deleteNode(nodeId)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      this.submitContent()
      focusNodeBelow(nodeId)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      this.submitContent()
      focusNodeAbove(nodeId)
    } else if (e.key === 'v' && (e.metaKey || e.cntrlKey)) {
      // if there are bullets from within the app copied, then paste those and prevent further actions
      // else do nothing
    } else if (e.key === 'c' && (e.metaKey || e.cntrlKey)) {
      // determine what nodes are selected, and copy them to a clipboardData
    } else if (e.key === 'z' && e.shiftKey && (e.metaKey || e.cntrlKey)) {
      redo()
    } else if (e.key === 'z' && (e.metaKey || e.cntrlKey)) {
      undo()
    }
  }

  onAddTag (suggestionId, suggestionDisplay) {
    const { fetchDataIfNeeded, nodeId } = this.props
    fetchDataIfNeeded(nodeId, suggestionId, 'all')
  }

  onRemoveTag (suggestionId, suggestionDisplay) {

  }

  submitContent () {
    const { id, content, updateContent } = this.props
    if (this.state.content !== content) {
      updateContent(id, this.state.content)
    }
  }

  // rendering

  render () {
    const { focused } = this.props
    const { content } = this.state
    const suggestions = [] // todo

    return (
      <MentionsInput
        singleLine
        value={content}
        onChange={(e, value) => this.onChange(e, value)}
        style={defaultStyle({ singleLine: true })}
        placeholder={''}
        focused={focused}
        onBlur={(e) => this.onBlur(e)}
        onKeyDown={(e) => this.onKeyDown(e)} >

        <Mention
          onAdd={(e) => this.onAddTag(e)}
          onRemove={(e) => this.onRemoveTag(e)}
          data={suggestions}
          style={defaultMentionStyle} />
      </MentionsInput>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return state.tree.present[ownProps.nodeId]
}

const ConnectedBulletEditContentView = connect(mapStateToProps, actions)(BulletEditContentView)
export default ConnectedBulletEditContentView
