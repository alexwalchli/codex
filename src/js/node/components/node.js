import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actionCreators from '../actions/node-action-creators'
import BulletEditContentView from './bullet-edit-content-view'
import BulletNotes from './bullet-notes'
import BulletMenu from './bullet-menu'
import BulletIcon from './bullet-icon'
import * as nodeSelectors from '../selectors/node-selectors'

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
    const { parentId, childIds, id, focused, collapsedBy, visible, selected, completed, notes, positionInOrderedList,
            nodeInitialized, currentlySelectedBy, currentlySelectedById, auth, menuVisible, rootNodeId, lastChild } = this.props
    const { content } = this.state

    if (!nodeInitialized) {
      return (false)
    }

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
    if (collapsedBy[auth.id]) {
      bulletClasses += ' collapsed'
    }
    if (completed) {
      bulletClasses += ' completed'
    }

    let currentlySelectedByAnotherUser = currentlySelectedById && currentlySelectedById !== auth.id
    let currentlySelectedCss = currentlySelectedById && currentlySelectedByAnotherUser ? 'currentlySelected' : null

    return (
      <div className={bulletClasses}>

        { parentId !== rootNodeId
            ? <div className='vertex-horizontal' />
            : null }
        { parentId !== rootNodeId
            ? <div className='vertex-vertical' />
            : null }

        { typeof parentId !== 'undefined'
          ? <div className={`depth ${currentlySelectedCss}`}>
            <div className='add-btn inline-btn' onClick={(e) => this.onAddBulletButtonClick(e)}><i className='icon dripicons-plus' /></div>
            <div className='menu-btn inline-btn' onClick={(e) => this.onToggleBulletMenuClick(e)}><i className='icon dripicons-menu' /></div>
            { menuVisible
              ? <BulletMenu
                nodeId={id}
                />
              : null }

            <BulletIcon nodeId={id} positionInOrderedList={positionInOrderedList} />
            <div
              className='content'
              onMouseEnter={(e) => this.onContentMouseEnter(e)}
              onMouseLeave={(e) => this.onContentMouseLeave(e)}
              onPaste={(e) => this.onContentPaste(e)}
              onClick={(e) => this.onContentClick(e)}>
              <BulletEditContentView
                nodeId={id}
                content={content}
                focused={focused}
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

        { !collapsedBy[auth.id]
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
