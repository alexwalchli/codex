import * as nodeActions from '../../../src/js/node/actions/node-actions'
import * as nodeActionTypes from '../../../src/js/node/actions/node-action-types'
import { expect } from 'chai'

describe('node actions', () => {
  describe('nodeTagsUpdated', () => {
    it('should create a nodeTagsUpdated action', () => {
      const nodeId = '123'
      const updatedTagIds = ['inprogress', 'nextweek']
      const result = nodeActions.nodeTagsUpdated(nodeId, updatedTagIds)

      expect(result).to.deep.equal({
        type: nodeActionTypes.NODE_TAGS_UPDATED,
        nodeId,
        payload: { updatedTagIds }
      })
    })
  })
})

