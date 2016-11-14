
export const autoCompleteQueryWithSelectedSuggestion = (caretPosition, inputValue, query, suggestion) => {
  const suggestionText = suggestion.trigger + suggestion.label
  const beginningPlusSuggestion = inputValue.substr(0, caretPosition.selectionStart - query.length) + suggestionText
  const end = inputValue.substr(caretPosition.selectionStart)

  return beginningPlusSuggestion + end
}
