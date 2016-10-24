import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions/node'
import _ from 'lodash'
import BulletEditContentView from './bullet-edit-content-view'
import BulletReadContentView from './bullet-read-content-view'
import BulletNotes from './bullet-notes'
import BulletMenu from './bullet-menu'
import BulletIcon from './bullet-icon'

export class Node extends Component {
  constructor (props) {
    super(props)

    this.state = {
      tags: [],
      content: props.content,
      notes: props.notes
    }
  }

  // ////////////////////
  // component events //
  // ////////////////////

  componentWillReceiveProps (newProps) {
    this.setState({
      externalData: newProps.externalData,
      content: newProps.content,
      notes: newProps.notes
    })
  }

  componentDidUpdate () {
    const {notesFocused} = this.props
    if (notesFocused) {
      this.refs.notesInput.focus()
    }
  }

  // //////////////////
  // event handling //
  // //////////////////

  onContentMouseEnter (e) {
    this.selectNodeIfHoldingMouseDown(e)
  }

  onContentMouseLeave (e) {
    this.selectNodeIfHoldingMouseDown(e)
  }

  onContentClick (e) {
    const { id, focusNode, selectNode } = this.props

    if (e.ctrlKey || e.metaKey) {
      selectNode(id)
    } else {
      focusNode(id)
    }
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

  selectNodeIfHoldingMouseDown (e) {
    const { selectNode, id } = this.props
    if (e.nativeEvent.which === 1 && !this.props.selected && this.props.id !== '0') {
      selectNode(id)
      e.stopPropagation()
    }
  }

  // /////////////
  // rendering //
  // /////////////

  renderChild (childId) {
    const { id } = this.props
    return (
      <div key={childId}>
        <ConnectedNode id={childId} parentId={id} />
      </div>
    )
  }

  render () {
    const { parentId, childIds, id, focused, collapsed, visible, selected, completed, notes, positionInOrderedList,
            nodeInitialized, currentlySelectedBy, currentlySelectedById, auth, menuVisible } = this.props
    const { content, editingNotes } = this.state

    if (!nodeInitialized) {
      return (false)
    }

    var bulletClasses = 'item'
    if (focused) {
      bulletClasses += ' focused'
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
    if (collapsed) {
      bulletClasses += ' collapsed'
    }
    if (completed) {
      bulletClasses += ' completed'
    }

    let currentlySelectedByAnotherUser = currentlySelectedById && currentlySelectedById !== auth.id
    let currentlySelectedCss = currentlySelectedById && currentlySelectedByAnotherUser ? 'currentlySelected' : null

    return (
      <div className={bulletClasses}>
        { typeof parentId !== 'undefined'
          ? <div className={`depth ${currentlySelectedCss}`}>
            <div className='menu-btn' onClick={(e) => this.onToggleBulletMenuClick(e)}><i className='icon dripicons-menu' /></div>
            { menuVisible
              ? <BulletMenu
                nodeId={id}
                />
              : null }

            <div className='children-outline' />

            <BulletIcon nodeId={id} positionInOrderedList={positionInOrderedList} />

            <div
              className='content'
              onMouseEnter={(e) => this.onContentMouseEnter(e)}
              onMouseLeave={(e) => this.onContentMouseLeave(e)}
              onPaste={(e) => this.onContentPaste(e)}
              onClick={(e) => this.onContentClick(e)}>
              { focused
                ? <BulletEditContentView
                  nodeId={id}
                  content={content}
                  focused={focused}
                  />
                : <BulletReadContentView
                  nodeId={id}
                  content={content}
                  /> }
            </div>

            <BulletNotes
              nodeId={id}
              currentlyEditing={editingNotes}
              notes={notes} />

            { currentlySelectedByAnotherUser
            ? <div className='currentlySelectedBy'>
              <span>{currentlySelectedBy}</span>
            </div>
            : null }

          </div>
        : null }
        <div className='children'>
          { childIds.map(this.renderChild.bind(this)) }
        </div>
      </div>
    )
  }
}

// react redux

const mapStateToProps = (state, ownProps) => {
  const nodeFromState = state.tree.present[ownProps.id]
  const parentNode = state.tree.present[ownProps.parentId]

  let positionInOrderedList
  if (parentNode && parentNode.displayMode === 'ordered') {
    positionInOrderedList = parentNode.childIds.indexOf(ownProps.id) + 1
  }

  return Object.assign({ nodeInitialized: !!nodeFromState, auth: state.auth, positionInOrderedList, ...ownProps }, nodeFromState)
}

const ConnectedNode = connect(mapStateToProps, actions)(Node)
export default ConnectedNode
