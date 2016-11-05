import React, { Component } from 'react'
import SuggestionBox from './suggestion-box'
import Textarea from 'react-textarea-autosize'
import * as actions from '../../actions'
import { connect } from 'react-redux'
import Highlighter from './Highlighter'

export class IntellisenseInput extends Component {

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
        this.setState({
          suggestionBoxVisible: true,
          currentSuggestions: this.querySuggestions(e.key),
          currentQuery: e.key,
          selectedSuggestionIndex: 0 })
      }
    } else {
      if (e.key === 'ArrowDown' && this.state.suggestionBoxVisible) {
        return this.shiftSelectedSuggestion(e, true)
      } else if (e.key === 'ArrowUp' && this.state.suggestionBoxVisible) {
        return this.shiftSelectedSuggestion(e, false)
      } else if ((e.key === 'Enter' || e.key === 'Tab' || e.key === ' ') && (this.state.suggestionBoxVisible)) {
        return this.executeSuggestionSelection(e)
      } else if (e.key === ' ' && this.state.currentQuery && this.state.currentQuery.startsWith('#')) {
        return this.executeSuggestionSelection(e)
      } else if (e.key === 'Backspace' && this.state.suggestionBoxVisible) {
        const newQuery = this.state.currentQuery.slice(0, -1)
        if (newQuery) {
          this.setState({ currentSuggestions: this.querySuggestions(newQuery), currentQuery: newQuery })
          return
        }
      } else if (this.state.suggestionBoxVisible) {
        const newQuery = this.state.currentQuery + e.key
        this.setState({ currentSuggestions: this.querySuggestions(newQuery), currentQuery: newQuery })
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

  onTextInputSelect (e) {
    this.setState({
      selectionStart: e.target.selectionStart,
      selectionEnd: e.target.selectionEnd
    })
  }

  onSuggestionSelected (e, suggestion) {
    if (this.props.onSuggestionSelected) {
      return this.props.onSuggestionSelected(e, suggestion)
    }
  }

  // rendering

  renderSuggestionBox () {
    const { currentSuggestions, selectedSuggestionIndex } = this.state

    if (this.state.suggestionBoxVisible) {
      return (
        <SuggestionBox
          ref='suggestionBox'
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
          onBlur={(e) => this.onTextInputBlur(e)}
          onSelect={(e) => this.onTextInputSelect(e)} />
        {this.renderSuggestionBox()}
        <Highlighter value={currentInputValue} />
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
    const { onCommandSelected, createTag } = this.props
    const { currentSuggestions, currentQuery, selectedSuggestionIndex, currentInputValue } = this.state
    const selectedSuggestion = currentSuggestions[selectedSuggestionIndex]

    this.setState({ suggestionBoxVisible: false })

    if (currentQuery.startsWith('#') && !selectedSuggestion) {
      const tagLabel = currentQuery.substring(1, currentQuery.length)
      createTag('#', tagLabel.toLowerCase(), tagLabel)
      return
    }

    e.stopPropagation()
    e.preventDefault()

    if (selectedSuggestion.type === 'COMMAND') {
      this.setState({
        currentInputValue: currentInputValue.replace(currentQuery, '')
      })
      onCommandSelected && onCommandSelected(e, selectedSuggestion)
    } else if (selectedSuggestion.type === 'TAG') {
      const caretPosition = this.getCurrentCaretPosition()
      const newInputValue = currentInputValue.substr(0, caretPosition.selectionStart - currentQuery.length) +
        '#' + selectedSuggestion.label +
        currentInputValue.substr(caretPosition.selectionStart + ('#' + selectedSuggestion.label).length)

      this.setState({
        currentInputValue: newInputValue
      })
    }

    this.setState({
      suggestionBoxVisible: false,
      currentSuggestions: [],
      currentQuery: null
    })
  }

  getCurrentCaretPosition () {
    const { selectionStart, selectionEnd } = this.refs.textInput

    return {
      selectionStart,
      selectionEnd
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

// react redux

function mapStateToProps (state, ownProps) {
  let tags = state.tags.map(t => ({
    type: 'TAG',
    label: t.label,
    trigger: '#',
    filterText: t.id,
    insertText: null,
    highlight: false
  }))

  let intellisenseData = {
    '#': tags,
    '/': [
      {
        type: 'COMMAND',
        action: 'COMPLETE_NODE',
        label: 'Complete',
        trigger: '/',
        filterText: 'Complete',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COMPLETE_ALL_NODES',
        label: 'Complete all under',
        trigger: '/',
        filterText: 'Complete all',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'DELETE_NODE',
        label: 'Delete',
        trigger: '/',
        filterText: 'Delete',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COLLAPSE',
        label: 'Collapse',
        trigger: '/',
        filterText: 'Collapse',
        insertText: null,
        highlight: false
      },
      {
        type: 'COMMAND',
        action: 'COLLAPSE_ALL',
        label: 'Collapse all under',
        trigger: '/',
        filterText: 'Collapse all',
        insertText: null,
        highlight: false
      }
    ]
  }
  return {
    data: intellisenseData,
    ...ownProps
  }
}

const ConnectedIntellisenseInput = connect(mapStateToProps, actions)(IntellisenseInput)
export default ConnectedIntellisenseInput
