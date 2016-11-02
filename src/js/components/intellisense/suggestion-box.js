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
    const { suggestions } = this.props

    return (
      <div className='intellisense-suggestion-box'>
        <ul className='suggestions'>
          {suggestions.map((suggestion, idx) => { return this.renderSuggestion(suggestion, idx) })}
        </ul>
      </div>
    )
  }

}
