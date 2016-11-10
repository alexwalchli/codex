import * as intellisenseHelpers from '../../../src/js/intellisense/helpers/intellisense-helpers'
import { expect } from 'chai'

describe('intellisense helpers', () => {
  describe('autoCompleteQueryWithSelectedSuggestion', () => {
    it('should autocomplete a suggestion', () => {
      const caretPosition = {
        selectionStart: 14,
        selectedEnd: 14
      }
      const currentQuery = '#t'
      const selectedSuggestion = {
        type: '#',
        label: 'todo'
      }

      const result1 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(caretPosition, 'a todo item #t', currentQuery, selectedSuggestion)
      const result2 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(caretPosition, 'a todo item #to', currentQuery, selectedSuggestion)
      const result3 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(caretPosition, 'a todo item #todo', currentQuery, selectedSuggestion)

      expect(result1).to.equal('a todo item #todo')
      expect(result2).to.equal('a todo item #todo')
      expect(result3).to.equal('a todo item #todo')
    })
  })
})
