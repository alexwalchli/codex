import React, { Component } from 'react'
import Suggestion from './suggestion'

export default class SuggestionBox extends Component {

  renderSuggestion (suggestion, idx) {
    const { selectedSuggestionIndex, key } = this.props
    const suggestionKey = 'suggestion-' + idx
    return (
      <Suggestion
        key={suggestionKey}
        id={suggestion.id}
        label={suggestion.label}
        selected={idx === selectedSuggestionIndex} />
    )
  }

  render () {
    const { suggestions, caretPosition } = this.props
    let style = {
      position: 'absolute',
      left: caretPosition ? caretPosition.left : 0,
      top: caretPosition ? caretPosition.top + caretPosition.height : 0
    }

    return (
      <div className='intellisense-suggestion-box' style={style}>
        { suggestions.length
        ? <div className='instruction'>Continue typing to filter</div>
        : <div className='instruction'>Nothing here yet</div> }
        <ul className='suggestions'>
          {suggestions.map((suggestion, idx) => { return this.renderSuggestion(suggestion, idx) })}
        </ul>
      </div>
    )
  }

}
