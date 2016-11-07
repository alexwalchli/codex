import * as tagActions from '../../src/js/tag/actions/tag-actions'
import * as tagActionTypes from '../../src/js/tag/actions/tag-action-types'
import { expect } from 'chai'

describe('tags action', () => {
  describe('tagCreated', () => {
    it('should create a proper tag created action', () => {
      const tagCreatedAction = tagActions.tagCreated('#', 'newtag', 'New Tag')

      expect(tagCreatedAction).to.deep.equal({
        type: tagActionTypes.TAG_CREATED,
        payload: {
          tag: {
            type: '#',
            id: 'newtag',
            label: 'New Tag'
          }
        }
      })
    })
  })
})

