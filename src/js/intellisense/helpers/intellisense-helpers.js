
export const autoCompleteQueryWithSelectedSuggestion = (caretPosition, inputValue, query, suggestion) => {
  return inputValue.substr(0, caretPosition.selectionStart - query.length) +
          suggestion.trigger + suggestion.label +
          inputValue.substr(caretPosition.selectionStart + (suggestion.trigger + suggestion.label).length)
}

export const renderHighlights = (value) => {

}
