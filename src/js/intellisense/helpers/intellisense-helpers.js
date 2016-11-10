
export const autoCompleteQueryWithSelectedSuggestion = (caretPosition, inputValue, query, suggestion) => {
  return inputValue.substr(0, caretPosition.selectionStart - query.length) +
          suggestion.type + suggestion.label +
          inputValue.substr(caretPosition.selectionStart + (suggestion.type + suggestion.label).length)
}

export const renderHighlights = (value) => {

}
