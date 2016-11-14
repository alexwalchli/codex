import * as intellisenseHelpers from '../../../src/js/intellisense/helpers/intellisense-helpers'
import { expect } from 'chai'

describe('intellisense helpers', () => {
  describe('autoCompleteQueryWithSelectedSuggestion', () => {
    it('should autocomplete a suggestion when the suggestion is at the end', () => {
      const selectedSuggestion = {
        trigger: '#',
        label: 'todo'
      }

      const result1 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(
        { selectionStart: 14, selectedEnd: 14 },
        'a todo item #t',
        '#t',
        selectedSuggestion
      )
      const result2 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(
        { selectionStart: 15, selectedEnd: 15 },
        'a todo item #to',
        '#to',
        selectedSuggestion
      )
      const result3 = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(
        { selectionStart: 17, selectedEnd: 17 },
        'a todo item #todo',
        '#todo',
        selectedSuggestion
      )

      expect(result1).to.equal('a todo item #todo')
      expect(result2).to.equal('a todo item #todo')
      expect(result3).to.equal('a todo item #todo')
    })
    it('should autocomplete a suggestion when the suggestion is in the middle', () => {
      const caretPositionInMiddle = { selectionStart: 5, selectedEnd: 5 }
      const selectedSuggestion = { trigger: '#', label: 'todo' }

      const result = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(caretPositionInMiddle, 'a #to item', '#to', selectedSuggestion)

      expect(result).to.equal('a #todo item')
    })
    it('should autocomplete a suggestion when the suggestion is at the beginning', () => {
      const caretPositionAtBeginning = { selectionStart: 2, selectedEnd: 2 }
      const selectedSuggestion = { trigger: '#', label: 'todo' }

      const result = intellisenseHelpers.autoCompleteQueryWithSelectedSuggestion(caretPositionAtBeginning, '#t', '#t', selectedSuggestion)

      expect(result).to.equal('#todo')
    })
  })
})
