import React, { Component } from 'react'

export default class SuggestionBox extends Component {

  renderSuggestion (suggestion) {
    return (
      <li>{suggestion.label}</li>
    )
  }

  render () {
    const { data } = this.props

    const items = data['/']

    return (
      <div className='intellisense-suggestion-box'>
        <ul>
          {items.map(this.renderSuggestion)}
        </ul>
      </div>
    )
  }

}
