import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions/node-action-creators'

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
    let valueWithHighlights = value
    let components = []
    const words = valueWithHighlights.split(' ')
    words.forEach((w, idx) => {
      const tag = tags.find(t => (t.type + t.label) === w)
      if (tag) {
        components.push(this.renderTag(tag.label))
      } else {
        components.push(this.renderText(w))
      }
    })

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
