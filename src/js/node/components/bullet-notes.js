import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import * as nodeSelectors from '../node-selectors'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import { allPlugins } from '../utilities/editor-plugins'
// import { extractHashtagsWithIndices } from '../utilities/hashtag-extractor'
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import * as I from 'immutable'

const mentions = I.fromJS([
  {
    name: 'Collapse All'
  },
  {
    name: 'Expand All'
  }
])

export class BulletNotes extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: createEditorStateWithText(this.props.notes),
      suggestions: mentions
    }
  }

  componentDidMount () {
    this.maybeFocus()
  }

  componentDidUpdate () {
    this.maybeFocus()
  }

  onBlur (e) {
    const { nodeId, updateNodeNotes } = this.props

    updateNodeNotes(nodeId, this.currentContent())
    this.setState({ editingNotes: false })
  }

  onEditorKeyDown (e) {
    const { nodeId, focusNode, focusNodeBelow } = this.props

    if (e.key === 'Enter') {
      e.stopPropagation()
    } else if (e.key === 'Backspace' && !this.currentContent()) {
      e.stopPropagation()
      this.setState({ editingNotes: false })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      focusNodeBelow(nodeId)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      focusNode(nodeId)
    } else {
      this.setState({ editingNotes: true })
    }
  }

  onSearchChange ({ value }) {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  onAddMention () {
    // get the mention object selected
  }

  onClick (e) {
    e.stopPropagation()
    const { nodeId, focusNode } = this.props

    focusNode(nodeId, true)
  }

  onEditorChange (editorState) {
    this.setState({ editorState })
  }

  onEditorArrowDown (editorState) {
    const { nodeId, focusNodeBelow } = this.props

    if (this.state.editorState.isSelectionAtEndOfContent()) {
      focusNodeBelow(nodeId)
    }
  }

  onEditorArrowUp (editorState) {
    const { nodeId, focusNode } = this.props

    if (this.state.editorState.isSelectionAtStartOfContent()) {
      focusNode(nodeId) // focus the node that these notes belong to
    }
  }

  currentContent () {
    return this.state.editorState.getCurrentContent().getPlainText()
  }

  currentSelection () {
    return this.refs.editor.getEditorState().getSelection()
  }

  maybeFocus () {
    const alreadyFocused = this.currentSelection().get('hasFocus')
    if (!alreadyFocused && this.props.notesFocused) {
      this.refs.editor.editor.focus()
    }
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
        <Editor
          ref='editor'
          plugins={allPlugins}
          editorState={this.state.editorState}
          onChange={(editorState) => this.onEditorChange(editorState)}
          onBlur={(e) => this.onBlur(e)}
          keyBindingFn={(e) => this.onEditorKeyDown(e)}
          onUpArrow={(e) => this.onEditorArrowUp(e)}
          onDownArrow={(e) => this.onEditorArrowDown(e)}
        />
      </div>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return {
    ...nodeSelectors.getNode(state, ownProps.nodeId).toJS(),
    ...ownProps
  }
}

const ConnectedBulletNotes = connect(mapStateToProps, actionCreators)(BulletNotes)
export default ConnectedBulletNotes

//  { editingNotes || notesFocused
//           ? <Textarea ref='notesInput'
//             defaultValue={notes}
//             onBlur={(e) => this.onBlur(e)}
//             onKeyDown={(e) => this.onKeyDown(e)} />
//           : <div dangerouslySetInnerHTML={this.getHtmlNotes()} />}
