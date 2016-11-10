import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../../node/actions/node-action-creators'

export class Highlighter extends Component {

  renderTag (label) {
    return (
      <strong className='tag'>{label}</strong>
    )
  }

  renderText (text) {
    return (
      <span>{text}</span>
    )
  }

  render () {
    const { value, tags } = this.props
    let components = []
    const words = value.split(/(\s+)/)
    let plainTextWordTrail = ''
    for (let i = 0; i < words.length; i++) {
      let matchingTag = tags.find(t => (t.type + t.label) === words[i])
      if (matchingTag) {
        components.push(this.renderText(plainTextWordTrail))
        components.push(this.renderTag(matchingTag.type + matchingTag.label))
        plainTextWordTrail = ''
      } else {
        plainTextWordTrail += words[i]
        if (i === words.length - 1) {
          // we're at the end, wrap it up
          components.push(this.renderText(plainTextWordTrail))
        }
      }
    }

    return (
      <div className='highlighter'>
        { components }
        <span className='caret' style={{ width: '10px', backgroundColor: 'red' }} ref='caret'>C</span>
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
