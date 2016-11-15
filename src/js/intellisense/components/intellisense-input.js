import React, { Component } from 'react'
import SuggestionBox from './suggestion-box'
import Textarea from 'react-textarea-autosize'
import * as nodeActionCreators from '../../node/actions/node-action-creators'
import * as tagActionCreators from '../../tag/actions/tag-action-creators'
import { connect } from 'react-redux'
import Highlighter from './Highlighter'
import { autoCompleteQueryWithSelectedSuggestion } from '../helpers/intellisense-helpers'
import * as intellisenseSelectors from '../selectors/intellisense-selectors'
import * as nodeSelectors from '../../node/selectors/node-selectors'

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
    this.setState({
      currentInputValue: newValue
    })

    if (this.props.onChange) {
      return this.props.onChange(e, newValue)
    }
  }

  onTextInputKeyDown (e) {
    // TODO: Clean this up

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
    if (this.state.suggestionBoxVisible) {
      const { currentSuggestions, selectedSuggestionIndex, caretPosition } = this.state

      return (
        <SuggestionBox
          ref='suggestionBox'
          suggestions={currentSuggestions}
          onSuggestionSelected={(e, suggestion) => this.onSuggestionSelected(e, suggestion)}
          selectedSuggestionIndex={selectedSuggestionIndex}
          caretPosition={caretPosition} />
      )
    }

    return ''
  }

  render () {
    const { nodeId } = this.props
    const { currentInputValue, selectionStart, selectionEnd } = this.state

    return (
      <div className='intellisense-container'>
        <Textarea
          ref='textInput'
          value={currentInputValue}
          onChange={(e) => this.onTextInputChange(e)}
          onKeyDown={(e) => this.onTextInputKeyDown(e)}
          onBlur={(e) => this.onTextInputBlur(e)}
          onSelect={(e) => this.onTextInputSelect(e)}
        />
        {this.renderSuggestionBox()}
        <Highlighter
          nodeId={nodeId}
          value={currentInputValue}
          onCaretPositionChange={(e, position) => this.onCaretPositionChange(e, position)}
          selection={{
            start: selectionStart,
            end: selectionEnd
          }}
        />
      </div>
    )
  }

  // util

  onCaretPositionChange (e, position) {
    this.setState({
      caretPosition: position
    })
  }

  toggleTextInputFocus () {
    if (this.props.focused) {
      this.refs.textInput.focus()
    } else {
      this.refs.textInput.blur()
    }
  }

  isTriggerCharacter (key) {
    const { suggestions } = this.props
    return !!suggestions[key]
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
    const { nodeId, onCommandSelected, createTag, addTagToNode, updateContent } = this.props
    const { currentSuggestions, currentQuery, selectedSuggestionIndex, currentInputValue } = this.state
    const selectedSuggestion = currentSuggestions[selectedSuggestionIndex]

    this.setState({ suggestionBoxVisible: false })

    if (currentQuery.startsWith('#') && !selectedSuggestion) {
      const tagLabel = currentQuery.substring(1, currentQuery.length)
      createTag('#', tagLabel, nodeId)
      updateContent(nodeId, currentInputValue)
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
      const newInputValue = autoCompleteQueryWithSelectedSuggestion(caretPosition, currentInputValue, currentQuery, selectedSuggestion)

      addTagToNode(nodeId, selectedSuggestion.id)

      this.setState({
        currentInputValue: newInputValue
      })
    }

    updateContent(nodeId, currentInputValue)

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
    const { suggestions } = this.props
    const triggerChar = query.substring(0, 1)
    const queryText = query.substring(1, query.length)

    return suggestions[triggerChar].filter(i => i.label.toLowerCase().startsWith(queryText))
  }

}

// react redux

function mapStateToProps (state, ownProps) {
  return {
    suggestions: intellisenseSelectors.allSuggestions(state),
    node: nodeSelectors.getNodeDataForComponent(state),
    ...ownProps
  }
}

const ConnectedIntellisenseInput = connect(mapStateToProps, { ...nodeActionCreators, ...tagActionCreators })(IntellisenseInput)
export default ConnectedIntellisenseInput
