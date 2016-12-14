import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import createEmojiPlugin from 'draft-js-emoji-plugin'
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import { extractHashtagsWithIndices } from '../utilities/hashtag-extractor'
import * as I from 'immutable'

const hashTagConfig = { theme: { hashtag: 'hashtag' } }
const linkifyConfig = {
  component: (props) => (
    <a {...props} className='editor-link' onClick={(e) => {
      var link = e.target.innerText
      if (link.includes('http://') || link.includes('http://')) {
        window.open(e.target.innerText)
      } else {
        window.open(`https://${e.target.innerText}`)
      }
    }} />
  )
}

const mentions = I.fromJS([
  {
    name: 'Collapse All'
  },
  {
    name: 'Expand All'
  }
])

const mentionPlugin = createMentionPlugin()
const emojiPlugin = createEmojiPlugin()
const hashtagPlugin = createHashtagPlugin(hashTagConfig)
const linkifyPlugin = createLinkifyPlugin(linkifyConfig)
const plugins = [
  mentionPlugin,
  hashtagPlugin,
  linkifyPlugin,
  emojiPlugin
]

const { MentionSuggestions } = mentionPlugin
const { EmojiSuggestions } = emojiPlugin

export class BulletContent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: createEditorStateWithText(this.props.content),
      suggestions: mentions
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.maybeFocus()
    }, 0)
  }

  componentDidUpdate () {
    setTimeout(() => {
      this.maybeFocus()
    }, 0)
  }

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
    const { nodeId, focusNodeAbove, shiftNodeUp, copyNodeUp } = this.props

    this.submitContent()
    if (e.altKey && e.shiftKey) {
      copyNodeUp(nodeId)
    } else if (e.altKey) {
      shiftNodeUp(nodeId)
    } else {
      focusNodeAbove(nodeId)
    }

    return 'handled'
  }

  onEditorArrowDown (e) {
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, focusNodeBelow, shiftNodeDown, copyNodeDown } = this.props

    this.submitContent()

    if (e.altKey && e.shiftKey) {
      copyNodeDown(nodeId)
    } else if (e.altKey) {
      shiftNodeDown(nodeId)
    } else {
      focusNodeBelow(nodeId)
    }

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

  onEditorFocus (e) {
    const { nodeId, focusNode } = this.props
    focusNode(nodeId)
  }

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  onAddMention = () => {
    // get the mention object selected
  }

  submitContent () {
    const { nodeId, content, updateNodeContent } = this.props
    const currentContent = this.currentContent()

    var tags = extractHashtagsWithIndices(currentContent)

    if (currentContent !== content) {
      updateNodeContent(nodeId, currentContent.trim(), tags.map(t => t.hashtag))
    }
  }

  currentContent () {
    return this.state.editorState.getCurrentContent().getPlainText()
  }

  maybeFocus () {
    const alreadyFocused = document.activeElement === findDOMNode(this.refs.editor.editor.refs.editor)
    if (!alreadyFocused && this.props.focused) {
      this.refs.editor.editor.focus()
    } else {
      // this.refs.editor.editor.blur()
    }
  }

  render () {
    return (
      <div>
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
          onFocus={(e) => { this.onEditorFocus(e) }}
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
  return { ...ownProps }
}

const ConnectedBulletContent = connect(mapStateToProps, actionCreators)(BulletContent)
export default ConnectedBulletContent
