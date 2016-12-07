import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import {Editor, EditorState} from 'draft-js'

export class BulletEditContentView extends Component {
  constructor (props) {
    super(props)

    this.state = {}
    this.onChange = (editorState) => this.setState({editorState})
    this.state = {
      content: props.content,
      editorState: EditorState.createEmpty()
    }
  }

  componentDidMount () {
    this.maybeFocus()
  }

  componentDidUpdate () {
    this.maybeFocus()
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

  onEditorKeyDown (e) {
    const { nodeId, createNode, deleteNode, focusNodeAbove, undo, redo,
            focusNodeBelow, parentId } = this.props
    e.stopPropagation()

    if (e.key === 'Enter') {
      e.preventDefault()
      this.submitContent()
      // if cursor is add the beginning of the input, add new node at current position, else below
      const offset = e.target.selectionEnd === 0 && e.target.value ? 0 : 1
      createNode(nodeId, offset, '')
    } else if (e.key === 'Backspace' && !this.currentContent()) {
      e.preventDefault()
      focusNodeAbove(nodeId)
      deleteNode(nodeId)
    } else if (e.key === 'ArrowDown') {
      
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

  onEditorTabDown (e) {
    e.preventDefault()
    const { nodeId, parentId, demoteNode, promoteNode } = this.props

    this.submitContent()
    if (e.shiftKey) {
      promoteNode(nodeId, parentId)
    } else {
      demoteNode(nodeId, parentId)
    }
  }

  onEditorArrowUp (e) {
    e.preventDefault()
    const { nodeId, focusNodeAbove } = this.props

    this.submitContent()
    focusNodeAbove(nodeId)
  }

  onEditorArrowDown (e) {
    e.preventDefault()
    const { nodeId, focusNodeBelow } = this.props

    this.submitContent()
    focusNodeBelow(nodeId)
  }

  submitContent () {
    const { nodeId, content, updateNodeContent } = this.props
    const currentContent = this.currentContent()
    if (currentContent !== content) {
      updateNodeContent(nodeId, currentContent.trim())
    }
  }

  currentContent () {
    return this.state.editorState.getCurrentContent().getPlainText()
  }

  maybeFocus () {
    if(this.props.focused) {
      this.refs['editor'].focus()
    }
  }

  // rendering

  render () {
    const { focused } = this.props
    const { editorState } = this.state

    return (
      <Editor
        ref='editor'
        editorState={editorState}
        onChange={this.onChange}
        focused={focused}
        onKeyDown={(e) => this.onKeyDown(e)}
        onUpArrow={(e) => this.onEditorArrowUp(e)}
        onDownArrow={(e) => this.onEditorArrowDown(e)}
        onTab ={(e) => this.onEditorTabDown(e)}
        onBlur={(e) => this.onBlur(e)}
        keyBindingFn={(e) => this.onEditorKeyDown(e)}
      />
      // <IntellisenseInput
      //   nodeId={nodeId}
      //   value={content}
      //   focused={focused}
      //   onBlur={(e) => this.onBlur(e)}
      //   onKeyDown={(e) => this.onKeyDown(e)}
      //   onChange={(e, value) => this.onChange(e, value)}
      //   onCommandSelected={(e, value) => this.onCommandSelected(e, value)} />
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return { ...ownProps }
}

const ConnectedBulletEditContentView = connect(mapStateToProps, actionCreators)(BulletEditContentView)
export default ConnectedBulletEditContentView
