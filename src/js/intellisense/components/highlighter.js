import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../../node/actions/node-action-creators'

export class Highlighter extends Component {

  constructor (props) {
    super(props)

    this.state = {
      lastCaretPosition: {}
    }
  }

  renderTag (label, key) {
    return (
      <strong key={key} className='tag'>{label}</strong>
    )
  }

  renderText (text, key) {
    return (
      <span key={key}>{text}</span>
    )
  }

  renderCaret (key) {
    return (
      <span key={key} className='caret' ref='caret'>&nbsp;</span>
    )
  }

  componentDidMount () {
    this.notifyCaretPosition()
  }

  componentDidUpdate () {
    this.notifyCaretPosition()
  }

  notifyCaretPosition (e) {
    let { caret } = this.refs

    if (!caret) {
      return
    }

    let caretPosition = {
      height: caret.offsetHeight,
      left: caret.offsetLeft,
      top: caret.offsetTop
    }

    let { lastCaretPosition } = this.state

    if (lastCaretPosition.left === caretPosition.left &&
        lastCaretPosition.top === caretPosition.top) {
      return
    }

    this.setState({
      lastCaretPosition: caretPosition
    })

    this.props.onCaretPositionChange(e, caretPosition)
  }

  render () {
    const { value, tags, selection } = this.props
    const words = value.split(/(\s+)/)
    let wrappedTextAndTagComponents = []
    let plainTextWordTrail = ''
    var positionInText = 0
    let caretRendered = false
    let componentKey = 0;

    // TODO: If cursor is in middle of a tag, it should still remain highlighted
    // TODO: Fix a bug if the cursor is right at the end of a tag, it won't highlight

    for (let i = 0; i < words.length; i++) {
      let matchingTag = tags.find(t => (t.type + t.label) === words[i])
      if (!caretRendered && positionInText + words[i].length > selection.end) {
        // this word contains the cursor position. Split it and place the caret in between.
        var plainTextWordTrailPlusCurrentWord = plainTextWordTrail + words[i]
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrailPlusCurrentWord.substring(0, selection.end), componentKey++))
        wrappedTextAndTagComponents.push(this.renderCaret(componentKey++))
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrailPlusCurrentWord.substring(selection.end, plainTextWordTrailPlusCurrentWord.length), componentKey++))
        caretRendered = true
        plainTextWordTrail = ''
      } else if (matchingTag) {
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrail, componentKey++))
        wrappedTextAndTagComponents.push(this.renderTag(matchingTag.type + matchingTag.label, componentKey++))
        plainTextWordTrail = ''
      } else {
        plainTextWordTrail += words[i]

        if (i === words.length - 1) {
          // we're at the end, wrap it up
          wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrail, componentKey++))
        }
      }

      positionInText += words[i].length
    }

    return (
      <div className='highlighter'>
        { wrappedTextAndTagComponents }
      </div>
    )
  }

}

// react redux

function mapStateToProps (state, ownProps) {
  const { taggedByIds } = state.tree.present[ownProps.nodeId]
  const tags = taggedByIds.map(tagId => { return state.tags.find(tag => tag.id === tagId) })

  return {
    tags,
    ...ownProps
  }
}

const ConnectedHighlighter = connect(mapStateToProps, actionCreators)(Highlighter)
export default ConnectedHighlighter
