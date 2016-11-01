import React, { Component } from 'react'
import SuggestionBox from './suggestion-box'

export default class IntellisenseInput extends Component {

  constructor (props) {
    super(props)

    this.state = {
      suggestionBoxVisible: false
    }
  }

  // react methods

  componentDidMount () {
    this.toggleTextInputFocus()
  }

  componentDidUpdate () {
    this.toggleTextInputFocus()
  }

  // events

  onTextInputChange (e) {
    const newValue = this.refs.textInput.value
    if (this.props.onChange) {
      return this.props.onChange(e, newValue)
    }
  }

  onTextInputKeyDown (e) {
    if (this.isTriggerCharacter(e.key)) {
      // render suggestionbox
      this.setState({ suggestionBoxVisible: true })
    } else if (this.props.onKeyDown) {
      return this.props.onKeyDown(e)
    }
  }

  onTextInputBlur (e) {
    if (this.props.onBlur) {
      return this.props.onBlur(e)
    }
  }

  // rendering

  renderSuggestionBox () {
    const { data } = this.props

    if (this.state.suggestionBoxVisible) {
      return (
        <SuggestionBox data={data} />
      )
    }

    return ''
  }

  render () {
    const { value } = this.props

    return (
      <div className='intellisense-input-container'>
        <textarea
          ref='textInput'
          value={value}
          onChange={(e) => this.onTextInputChange(e)}
          onKeyDown={(e) => this.onTextInputKeyDown(e)}
          onBlur={(e) => this.onTextInputBlur(e)} />
        {this.renderSuggestionBox()}
      </div>
    )
  }

  // util

  toggleTextInputFocus () {
    if (this.props.focused) {
      this.refs.textInput.focus()
    } else {
      this.refs.textInput.blur()
    }
  }

  isTriggerCharacter (key) {
    const { data } = this.props
    return data[key]
  }

}
