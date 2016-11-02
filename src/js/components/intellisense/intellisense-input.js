import React, { Component } from 'react'
import SuggestionBox from './suggestion-box'
import Textarea from 'react-textarea-autosize';

export default class IntellisenseInput extends Component {

  constructor (props) {
    super(props)

    this.state = {
      suggestionBoxVisible: false,
      selectedSuggestionIndex: 0,
      currentSuggestions: [],
      currentInputValue: props.value
    }
  }

  // react methods

  componentDidMount () {
    this.toggleTextInputFocus()
  }

  componentWillUpdate (nextProps) {
   
  }

  componentDidUpdate (nextProps) {
    this.toggleTextInputFocus()
  }

  // events

  onTextInputChange (e) {
    const newValue = this.refs.textInput.value
    this.setState({ currentInputValue: newValue }) 

    if (this.props.onChange) {
      return this.props.onChange(e, newValue)
    }
  }

  onTextInputKeyDown (e) {
    if (this.isTriggerCharacter(e.key)) {
      if (this.state.suggestionBoxVisible) {
        this.setState({ suggestionBoxVisible: false, currentSuggestions: [] })
      } else {
        this.setState({ suggestionBoxVisible: true, currentSuggestions: this.querySuggestions(e.key), currentQuery: e.key })
      }
    } else {
      if (e.key === 'ArrowDown' && this.state.suggestionBoxVisible) {
        return this.shiftSelectedSuggestion(e, true)
      } else if (e.key === 'ArrowUp' && this.state.suggestionBoxVisible) {
        return this.shiftSelectedSuggestion(e, false)
      } else if ((e.key === 'Enter' || e.key === 'Tab' || e.key === 'Space') && this.state.suggestionBoxVisible) {
        return this.executeSuggestionSelection(e)
      } else if (e.key === 'Backspace' && this.state.suggestionBoxVisible) {
        const newQuery = this.state.currentQuery.slice(0, -1)
        if (newQuery) {
          this.setState({ currentSuggestions: this.querySuggestions(newQuery), currentQuery: newQuery })
          return
        }
      } else if (this.state.suggestionBoxVisible) {
        const newQuery = this.state.currentQuery + e.key
        this.setState({ currentSuggestions: this.querySuggestions(newQuery), currentQuery: newQuery})
        return
      }

      this.setState({ 
        suggestionBoxVisible: false,
        currentSuggestions: [], 
        currentQuery: null
      })

      if (this.props.onKeyDown) {
        return this.props.onKeyDown(e)
      }
    }
  }

  onTextInputBlur (e) {
    if (this.props.onBlur) {
      return this.props.onBlur(e)
    }
  }

  onSuggestionSelected (e, suggestion) {
    if (this.props.onSuggestionSelected) {
      return this.props.onSuggestionSelected(e, suggestion)
    }
  }

  // rendering

  renderSuggestionBox () {
    const { data } = this.props
    const { currentSuggestions, selectedSuggestionIndex } = this.state

    if (this.state.suggestionBoxVisible) {
      return (
        <SuggestionBox 
          suggestions={currentSuggestions}
          onSuggestionSelected={(e, suggestion) => this.onSuggestionSelected(e, suggestion)}
          selectedSuggestionIndex={selectedSuggestionIndex} />
      )
    }

    return ''
  }

  render () {
    const { currentInputValue } = this.state

    return (
      <div className='intellisense-container'>
        <Textarea
          ref='textInput'
          value={currentInputValue}
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
    return !!data[key]
  }

  shiftSelectedSuggestion (e, down = true) {
    e.stopPropagation()
    e.preventDefault()
    const { selectedSuggestionIndex } = this.state
    const newSelectedSuggestionIndex = down ? selectedSuggestionIndex + 1 : selectedSuggestionIndex - 1
    this.setState({ selectedSuggestionIndex: newSelectedSuggestionIndex })
    if (newSelectedSuggestionIndex === -1) {
      this.setState({ suggestionBoxVisible: false })
    }
  }

  executeSuggestionSelection (e) {
    e.stopPropagation()
    e.preventDefault()
    const { data, onCommandSelected } = this.props
    const { currentSuggestions, currentQuery, selectedSuggestionIndex, currentInputValue } = this.state
    const selectedSuggestion = currentSuggestions[selectedSuggestionIndex]

    this.setState({ suggestionBoxVisible: false })

    if (selectedSuggestion.type === 'COMMAND') {
      onCommandSelected && onCommandSelected(e, selectedSuggestion)
      this.setState({ 
        suggestionBoxVisible: false, 
        currentSuggestions: [], 
        currentQuery: null, 
        currentInputValue: currentInputValue.replace(currentQuery, '') 
      })
    }
  }

  querySuggestions (query) {
    const { data } = this.props
    const triggerChar = query.substring(0, 1)
    const queryText = query.substring(1, query.length)

    return data[triggerChar].filter(i => i.label.toLowerCase().startsWith(queryText))
  }

  plainTextQuery (query) {
    return query.replace('/', '').replace('#').replace('@')
  }

}
