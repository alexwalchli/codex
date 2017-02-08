import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import * as actionCreators from '../node-action-creators'
import BulletContent from './bullet-content'
import BulletNotes from './bullet-notes'
import BulletMenu from './bullet-menu'
import BulletIcon from './bullet-icon'
import * as nodeSelectors from '../node-selectors'

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
    const { id, focusNode, selectNode } = this.props
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
    e.dataTransfer.setData('text', JSON.stringify(dragData)); 
  }

  onNodesDrop (e) {
    e.preventDefault()
    e.stopPropagation()
    const { moveNode } = this.props
    const { nodeId } = JSON.parse(e.dataTransfer.getData('text'));

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

  // /////////////
  // rendering //
  // /////////////

  renderChild (childId) {
    const { id } = this.props
    return (
      <ConnectedNode key={childId} id={childId} parentId={id} />
    )
  }

  render () {
    const { parentId, childIds, id, focused, collapsedBy, visible, selected, completed, notes, positionInOrderedList,
            nodeInitialized, currentlySelectedBy, currentlySelectedById, auth, menuVisible, rootNodeId, lastChild,
            currentlySearchingOn, isAncestorOfSearchResult } = this.props
    const { content, dragOver } = this.state

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
          ? <div onClick={(e) => this.onNodeClick(e)}
                 className={`depth ${depthCss}`}>
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

              <BulletContent
                nodeId={id}
                content={content}
                focused={focused}
                highlightText={currentlySearchingOn}
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
