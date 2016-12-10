import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'

const hashTagConfig = { theme: { hashtag: 'hashtag' } }
const linkifyConfig = { theme: { linkify: 'link' } }
const hashtagPlugin = createHashtagPlugin(hashTagConfig)
const linkifyPlugin = createLinkifyPlugin(linkifyConfig)
const plugins = [
  hashtagPlugin,
  linkifyPlugin
]

export class BulletContent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: createEditorStateWithText(this.props.content)
    }
  }

  componentDidMount () {
    this.maybeFocus()
  }

  componentDidUpdate () {
    this.maybeFocus()
  }

  // event handling

  onChange (editorState) {
    this.setState({
      editorState
    })
  }

  onBlur (e) {
    this.submitContent()
  }

  onEditorKeyDown (e) {
    const { nodeId, focusNodeAbove, deleteNode, undo, redo } = this.props
    // e.stopPropagation()

    if (e.key === 'Backspace' && !this.currentContent()) {
      e.preventDefault()
      focusNodeAbove(nodeId)
      deleteNode(nodeId)
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
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, parentId, demoteNode, promoteNode } = this.props

    this.submitContent()
    if (e.shiftKey) {
      promoteNode(nodeId, parentId)
    } else {
      demoteNode(nodeId, parentId)
    }

    return 'handled'
  }

  onEditorArrowUp (e) {
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, focusNodeAbove } = this.props

    this.submitContent()
    focusNodeAbove(nodeId)
  }

  onEditorArrowDown (e) {
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, focusNodeBelow } = this.props

    this.submitContent()
    focusNodeBelow(nodeId)

    return 'handled'
  }

  onEditorEnter (e) {
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, createNode } = this.props
    this.submitContent()

    // if cursor is add the beginning of the input, add new node at current position, else below
    const offset = e.target.selectionEnd === 0 && e.target.value ? 0 : 1
    createNode(nodeId, offset, '')

    return 'handled'
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
    if (this.props.focused) {
      setTimeout(() => {
        this.refs.editor.focus()
      }, 0)
    } else {
      setTimeout(() => {
        this.refs.editor.blur()
      }, 0)
    }
  }

  // rendering

  render () {
    return (
      <Editor
        ref='editor'
        plugins={plugins}
        editorState={this.state.editorState}
        onChange={(editorState) => this.onChange(editorState)}
        onUpArrow={(e) => this.onEditorArrowUp(e)}
        onDownArrow={(e) => this.onEditorArrowDown(e)}
        handleReturn={(e) => this.onEditorEnter(e)}
        onTab={(e) => this.onEditorTabDown(e)}
        onBlur={(e) => this.onBlur(e)}
        keyBindingFn={(e) => this.onEditorKeyDown(e)}
      />
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return { ...ownProps }
}

const ConnectedBulletContent = connect(mapStateToProps, actionCreators)(BulletContent)
export default ConnectedBulletContent
