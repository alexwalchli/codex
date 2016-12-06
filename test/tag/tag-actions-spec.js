import * as tagActions from '../../src/js/tag/tag-actions'
import * as tagActionTypes from '../../src/js/tag/tag-action-types'
import { expect } from 'chai'

describe('tags action', () => {
  describe('tagCreated', () => {
    it('should fire a TAG_ADDED and update the node in persistance', () => {
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

  describe('tagRemoved', () => {
    it('should fire a TAG_REMOVED and update the node in persistance', () => {
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

