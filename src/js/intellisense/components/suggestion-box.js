import React, { Component } from 'react'
import Suggestion from './suggestion'

export default class SuggestionBox extends Component {

  renderSuggestion (suggestion, idx) {
    const { selectedSuggestionIndex } = this.props

    return (
      <Suggestion
        id={suggestion.id}
        label={suggestion.label}
        selected={idx === selectedSuggestionIndex} />
    )
  }

  render () {
    const { suggestions, caretPosition } = this.props
    let style = {
      position: 'absolute',
      left: caretPosition.left,
      top: caretPosition.top + caretPosition.height
    }

    return (
      <div className='intellisense-suggestion-box' style={style}>
        <div className='instruction'>
          Continue typing to filter
        </div>
        <ul className='suggestions'>
          {suggestions.map((suggestion, idx) => { return this.renderSuggestion(suggestion, idx) })}
        </ul>
      </div>
    )
  }

}
