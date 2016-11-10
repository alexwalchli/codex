import * as intellisenseSelectors from '../../../src/js/intellisense/selectors/intellisense-selectors'
import { expect } from 'chai'

describe('intellisense selectors', () => {
  describe('allSuggestions', () => {
    it('should contain tags and commands', () => {
      const state = {
        tags: [
          { id: 'todo', label: 'todo' },
          { id: 'inprogress', label: 'inprogress' }
        ]
      }
      const expectedTagSuggestions = [
        {
          id: 'todo',
          type: 'TAG',
          label: 'todo',
          trigger: '#',
          filterText: 'todo',
          insertText: null,
          highlight: false
        },
        {
          id: 'inprogress',
          type: 'TAG',
          label: 'inprogress',
          trigger: '#',
          filterText: 'inprogress',
          insertText: null,
          highlight: false
        }
      ]

      const result = intellisenseSelectors.allSuggestions(state)

      expect(result['/']).to.not.equal(undefined)
      expect(result['#']).to.deep.equal(expectedTagSuggestions)
    })
  })
})
