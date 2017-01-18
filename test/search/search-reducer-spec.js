import { app } from '../../src/js/app/app-reducer'
import * as searchActions from '../../src/js/search/search-actions'
import { expect } from 'chai'
import * as I from 'immutable'

describe('searchReducer', () => {
  describe('SEARCH_RESULT', () => {
    it('should update currentlySearchingOn', () => {
      const searchResultAction = searchActions.searchResult('stuff', ['1', '2'])

      const newState = app(I.Map({}), searchResultAction)

      expect(newState.get('currentlySearchingOn')).to.equal(searchResultAction.phrase)
    })
  })
})
