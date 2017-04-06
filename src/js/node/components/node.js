import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actionCreators from '../node-action-creators'
import BulletNotes from './bullet-notes'
import BulletMenu from './bullet-menu'
import BulletIcon from './bullet-icon'
import * as nodeSelectors from '../node-selectors'

// draft js + plugins
import Editor from 'draft-js-plugins-editor'
import { allPlugins } from '../utilities/editor-plugins'
import { extractHashtagsWithIndices } from '../utilities/hashtag-extractor'
import {
  ContentState,
  EditorState
} from 'draft-js'
import { createHighlightDecorator } from '../draftjs/highlight-decorator'

export class Node extends Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromText(this.props.id),
        createHighlightDecorator()
      )
    }
  }

  //
  // component events
  //

  shouldComponentUpdate (nextProps, nextState) {
    const { content, parentId, childIds, collapsedBy, visible, completed, notes } = this.props

    if (parentId !== nextProps.parentId ||
        !_.isEqual(childIds, nextProps.childIds) ||
        content !== nextProps.content ||
        !_.isEqual(collapsedBy, nextProps.collapsedBy) ||
        visible !== nextProps.visible ||
        completed !== nextProps.completed ||
        notes !== nextProps.notes) {
      return true
    }

    return false
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      content: newProps.content,
      notes: newProps.notes
    })

    this.maybeFocus()
  }

  componentDidMount () {
    this.maybeFocus()
  }

  componentDidUpdate () {
    this.maybeFocus()
  }

  //
  // event handling
  //

  onEditorChange (editorState) {
    this.setState({ editorState })
  }

  onEditorBlur (e) {
    this.submitContent()
  }

  onEditorKeyDown (e) {
    const { id, focusNodeAbove, deleteNode, undo, redo } = this.props
    if (e.key === 'Backspace' && !this.currentContent()) {
      e.preventDefault()
      focusNodeAbove(id)
      deleteNode(id)
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
    const { id, parentId, demoteNode, promoteNode } = this.props

    this.submitContent()
    if (e.shiftKey) {
      promoteNode(id, parentId)
    } else {
      demoteNode(id, parentId)
    }

    return 'handled'
  }

  onEditorArrowUp (e) {
    e.stopPropagation()
    e.preventDefault()
    const { id, focusNodeAbove, shiftNodeUp, copyNodeUp } = this.props

    this.refs.editor.editor.blur()
    this.submitContent()

    if (e.altKey && e.shiftKey) {
      copyNodeUp(id)
    } else if (e.altKey) {
      shiftNodeUp(id)
    } else {
      const anchorPos = this.currentSelection().anchorOffset
      focusNodeAbove(id, anchorPos)
    }

    return 'handled'
  }

  onEditorArrowDown (e) {
    e.stopPropagation()
    e.preventDefault()
    const { id, focusNodeBelow, shiftNodeDown, copyNodeDown } = this.props

    this.refs.editor.editor.blur()
    this.submitContent()

    if (e.altKey && e.shiftKey) {
      copyNodeDown(id)
    } else if (e.altKey) {
      shiftNodeDown(id)
    } else {
      const anchorPos = this.currentSelection().anchorOffset
      focusNodeBelow(id, anchorPos)
    }

    return 'handled'
  }

  onEditorEnter (e) {
    e.stopPropagation()
    e.preventDefault()
    const { id, createNode } = this.props
    this.submitContent()

    // if cursor is add the beginning of the input, add new node at current position, else below
    const offset = e.target.selectionEnd === 0 && e.target.value ? 0 : 1
    createNode(id, offset, '')

    return 'handled'
  }

  onContentMouseEnter (e) {
    this.selectNodeIfHoldingMouseDown(e)
  }

  onContentMouseLeave (e) {
    this.selectNodeIfHoldingMouseDown(e)
  }

  onContentPaste (e) {
    const { parentId, id, createNode, addChild, focusNode } = this.props

    var pastedText = e.clipboardData.getData('Text')
    if (pastedText.indexOf('\n') > -1) {
      pastedText = pastedText.replace(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+/g, '') // remove bullets
      e.preventDefault() // prevent the pasted text from being pasted into the current node
      _.reverse(e.clipboardData.getData('Text').split('\n')).forEach(s => {
        s = s.trim()
        // remove initial dashes
        if (s[0] === '-') {
          s = s.slice(1, s.length)
        }
        var newSiblingId = createNode(id, 1, s).nodeId
        addChild(parentId, newSiblingId, id)
        focusNode(newSiblingId)
      })
    }
  }

  onToggleBulletMenuClick (e) {
    const { id, toggleNodeMenu } = this.props
    e.stopPropagation()
    toggleNodeMenu(id)
  }

  onAddBulletButtonClick (e) {
    const { id, createNode } = this.props
    createNode(id, 0, '')
  }

  selectNodeIfHoldingMouseDown (e) {
    const { selectNode, id } = this.props
    if (e.nativeEvent.which === 1 && !this.props.selected && this.props.id !== '0') {
      selectNode(id)
      e.stopPropagation()
    }
  }

  onNodeClick (e) {
    const { id, selectNode, focusNode } = this.props
    e.stopPropagation()
    e.preventDefault()

    if (e.ctrlKey || e.metaKey) {
      selectNode(id)
    } else {
      focusNode(id)
    }
  }

  onBulletIconDragState (e) {
    const dragData = {
      nodeId: this.props.id
    }
    e.dataTransfer.setData('text', JSON.stringify(dragData))
  }

  onNodesDrop (e) {
    e.preventDefault()
    e.stopPropagation()
    const { moveNode } = this.props
    const { nodeId } = JSON.parse(e.dataTransfer.getData('text'))

    this.setState({
      dragOver: false
    })

    moveNode(nodeId, this.props.id)
  }

  onNodesDragOver (e) {
    e.preventDefault()

    this.setState({
      dragOver: true
    })
  }

  onNodesDragExit (e) {
    this.setState({
      dragOver: false
    })
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
    setTimeout(() => {
      const currentSelectionState = this.currentSelection()
      const alreadyFocused = currentSelectionState.get('hasFocus')
      if (!alreadyFocused && this.props.focused) {
        this.refs.editor.focus()
      }
    }, 0)
  }

  //
  // rendering
  //

  renderChild (childId) {
    const { id } = this.props
    return (
      <ConnectedNode key={childId} id={childId} parentId={id} />
    )
  }

  render () {
    const { parentId, childIds, id, focused, collapsedBy, visible, selected, completed, notes, positionInOrderedList,
            nodeInitialized, currentlySelectedBy, currentlySelectedById, auth, menuVisible, rootNodeId, lastChild,
            isAncestorOfSearchResult } = this.props
    const { content, dragOver } = this.state

    console.log(`Rendering Node ${id}`)

    if (!nodeInitialized) {
      return (false)
    }

    // TODO: clean this crap up
    var bulletClasses = 'node'
    if (focused) {
      bulletClasses += ' focused'
    }
    if (lastChild) {
      bulletClasses += ' last-child'
    }
    if (visible === false) {
      bulletClasses += ' hidden'
    }
    if (selected) {
      bulletClasses += ' selected'
    }
    if (childIds.length > 0) {
      bulletClasses += ' has-children'
    } else {
      bulletClasses += ' no-children'
    }
    if (collapsedBy[auth.get('id')]) {
      bulletClasses += ' collapsed'
    }
    if (completed) {
      bulletClasses += ' completed'
    }
    if (isAncestorOfSearchResult) {
      bulletClasses += ' ancestor-of-search-result'
    }

    let currentlySelectedByAnotherUser = currentlySelectedById && currentlySelectedById !== auth.get('id')
    let depthCss = currentlySelectedById && currentlySelectedByAnotherUser ? 'currentlySelected' : ''
    depthCss += dragOver ? ' drag-over' : ''

    return (
      <div className={bulletClasses}>

        { parentId !== rootNodeId
            ? <div className='vertex-horizontal' />
            : null }
        { parentId !== rootNodeId
            ? <div className='vertex-vertical' />
            : null }

        { typeof parentId !== 'undefined'
          ? <div className={`depth ${depthCss}`} onClick={(e) => this.onNodeClick(e)}>
            <div className='inline-btn'>
              <div className='menu-btn btn' onClick={(e) => this.onToggleBulletMenuClick(e)}><i className='icon dripicons-dots-3' /></div>
            </div>
            { menuVisible
              ? <BulletMenu
                nodeId={id}
                />
              : null }

            <BulletIcon onDragStart={(e) => this.onBulletIconDragState(e)} nodeId={id} positionInOrderedList={positionInOrderedList} />
            <div className='drop-area' onDragOver={(e) => this.onNodesDragOver(e)}
              onDrop={(e) => this.onNodesDrop(e)}
              onDragLeave={(e) => this.onNodesDragExit(e)} >As a Child</div>
            <div
              className='content'
              onMouseEnter={(e) => this.onContentMouseEnter(e)}
              onMouseLeave={(e) => this.onContentMouseLeave(e)}
              onPaste={(e) => this.onContentPaste(e)}>

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
            </div>

            <BulletNotes
              nodeId={id}
              notes={notes} />

            { currentlySelectedByAnotherUser
            ? <div className='currentlySelectedBy'>
              <span>{currentlySelectedBy}</span>
            </div>
            : null }

          </div>
        : null }

        { !collapsedBy[auth.get('id')]
          ? <div className='children'>
            { childIds.map(this.renderChild.bind(this)) }
          </div>
          : null }
      </div>
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    ...nodeSelectors.getNodeProps(state, ownProps.id)
  }
}

const ConnectedNode = connect(mapStateToProps, actionCreators)(Node)
export default ConnectedNode
