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

  renderTag (label, idx) {
    return (
      <strong className='tag'>{label}</strong>
    )
  }

  renderText (text, idx) {
    return (
      <span>{text}</span>
    )
  }

  renderCaret () {
    return (
      <span className='caret' ref='caret'>&nbsp;</span>
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
    for (let i = 0; i < words.length; i++) {
      let matchingTag = tags.find(t => (t.type + t.label) === words[i])
      if (!caretRendered && positionInText + words[i].length >= selection.end) {
        // this word contains the cursor position. Split it and place the caret in between.
        var plainTextWordTrailPlusCurrentWord = plainTextWordTrail + words[i]
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrailPlusCurrentWord.substring(0, selection.end)))
        wrappedTextAndTagComponents.push(this.renderCaret())
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrailPlusCurrentWord.substring(selection.end, plainTextWordTrailPlusCurrentWord.length)))
        caretRendered = true
        plainTextWordTrail = ''
      } else if (matchingTag) {
        wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrail))
        wrappedTextAndTagComponents.push(this.renderTag(matchingTag.type + matchingTag.label))
        plainTextWordTrail = ''
      } else {
        plainTextWordTrail += words[i]

        if (i === words.length - 1) {
          // we're at the end, wrap it up
          wrappedTextAndTagComponents.push(this.renderText(plainTextWordTrail))
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
