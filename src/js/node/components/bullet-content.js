import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../node-action-creators'
import Editor from 'draft-js-plugins-editor'
import * as I from 'immutable'
import { allPlugins, mentionPlugin } from '../utilities/editor-plugins'
import { extractHashtagsWithIndices } from '../utilities/hashtag-extractor'
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin'
import {
  ContentState,
  EditorState
} from 'draft-js'
import { createHighlightDecorator } from '../draftjs/highlight-decorator'

const { MentionSuggestions } = mentionPlugin

const mentions = I.fromJS([
  {
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
    avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg'
  },
  {
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
    avatar: 'https://pbs.twimg.com/profile_images/477132877763579904/m5bFc8LF_400x400.png'
  }
])

export class BulletContent extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(this.props.nodeId),
        createHighlightDecorator()
      ),
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

  // shouldComponentUpdate (nextProps, nextState) {
  //   if(nextProps.content !== this.props.content) {
  //     return true
  //   }

  //   return false
  // }

  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.focused) {
  //     // const updatedSelectionState = this.currentSelection().merge({
  //     //   anchorOffset: nextProps.anchorPosition,
  //     //   // focusKey: newContent.getFirstBlock().getKey(),
  //     //   focusOffset: nextProps.anchorPosition
  //     // })
  //     // let updatedEditorState = EditorState.createWithContent(
  //     //   ContentState.createFromText(this.props.nodeId),
  //     //   createHighlightDecorator()
  //     // )
  //     // updatedEditorState = EditorState.forceSelection(updatedEditorState, updatedSelectionState)

  //     // this.setState({
  //     //   editorState: updatedEditorState
  //     // })
  //     this.maybeFocus()
  //     // setTimeout(() => {
  //     //   this.refs.editor.focus()
  //     // }, 0)
  //   }
  // }

  onEditorChange (editorState) {
    this.setState({ editorState })
  }

  onEditorBlur (e) {
    this.submitContent()
  }

  onEditorKeyDown (e) {
    const { nodeId, focusNodeAbove, deleteNode, undo, redo } = this.props
    if (e.key === 'Backspace' && !this.currentContent()) {
      e.preventDefault()
      focusNodeAbove(nodeId)
      deleteNode(nodeId)
    } else if (e.key === 'v' && (e.metaKey || e.cntrlKey)) {
      // if there are bullets from within the app copied, then paste those and prevent further actions
      // else do nothing
    } else if (e.key === 'c' && (e.metaKey || e.cntrlKey)) {
      // determine what nodes are selected, and copy them to a clipboardData
    } else if (e.key === 'Z' && e.shiftKey && (e.metaKey || e.cntrlKey)) {
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

    this.refs.editor.editor.blur()
    this.submitContent()

    if (e.altKey && e.shiftKey) {
      copyNodeUp(nodeId)
    } else if (e.altKey) {
      shiftNodeUp(nodeId)
    } else {
      const anchorPos = this.currentSelection().anchorOffset
      focusNodeAbove(nodeId, anchorPos)
    }

    return 'handled'
  }

  onEditorArrowDown (e) {
    e.stopPropagation()
    e.preventDefault()
    const { nodeId, focusNodeBelow, shiftNodeDown, copyNodeDown } = this.props

    this.refs.editor.editor.blur()
    this.submitContent()

    if (e.altKey && e.shiftKey) {
      copyNodeDown(nodeId)
    } else if (e.altKey) {
      shiftNodeDown(nodeId)
    } else {
      const anchorPos = this.currentSelection().anchorOffset
      focusNodeBelow(nodeId, anchorPos)
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

  onSearchChange (value) {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions)
    })
  }

  onAddMention () {
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

  currentSelection () {
    return this.refs.editor.getEditorState().getSelection()
  }

  maybeFocus () {
    const currentSelectionState = this.currentSelection()
    const alreadyFocused = currentSelectionState.get('hasFocus')
    if (!alreadyFocused && this.props.focused) {
      this.refs.editor.focus()
    }
  }

  onClick (e) {
    const { nodeId, focusNode } = this.props
    // this.refs.editor.editor.refs.editor.focus()
    e.stopPropagation()
    focusNode(nodeId)
  }

  render () {
    return (
      <div onClick={(e) => this.onClick(e)}>
        <Editor
          ref='editor'
          plugins={allPlugins}
          editorState={this.state.editorState}
          onChange={(editorState) => this.onEditorChange(editorState)}
          onUpArrow={(e) => this.onEditorArrowUp(e)}
          onDownArrow={(e) => this.onEditorArrowDown(e)}
          handleReturn={(e) => this.onEditorEnter(e)}
          onTab={(e) => this.onEditorTabDown(e)}
          onBlur={(e) => this.onEditorBlur(e)}
          keyBindingFn={(e) => this.onEditorKeyDown(e)}
        />
        <MentionSuggestions
          onSearchChange={() => this.onSearchChange()}
          suggestions={this.state.suggestions}
          onAddMention={() => this.onAddMention()}
        />
      </div>
    )
  }
}

// react redux

function mapStateToProps (state, ownProps) {
  return {
    ...ownProps
  }
}

const ConnectedBulletContent = connect(mapStateToProps, actionCreators)(BulletContent)
export default ConnectedBulletContent
