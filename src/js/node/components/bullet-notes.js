import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import Textarea from 'react-textarea-autosize'
import * as nodeSelectors from '../node-selectors'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import { allPlugins, MentionSuggestions, EmojiSuggestions} from '../utilities/editor-plugins'
import { extractHashtagsWithIndices } from '../utilities/hashtag-extractor'
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

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  onAddMention = () => {
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

    focusNodeBelow(nodeId)
  }

  onEditorArrowUp (editorState) {
    const { nodeId, focusNode } = this.props

    focusNode(nodeId)
  }

  currentContent () {
    return this.state.editorState.getCurrentContent().getPlainText()
  }

  maybeFocus () {
    const alreadyFocused = document.activeElement === findDOMNode(this.refs.editor.editor.refs.editor)
    setTimeout(() => {
      if (!alreadyFocused && this.props.notesFocused) {
        this.refs.editor.editor.focus()
      }
    }, 0)
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
        <EmojiSuggestions />
        <MentionSuggestions
          mentionTrigger='/'
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
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
