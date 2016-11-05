import * as nodeActions from '../../../src/js/actions/node/node-actions'
import { expect } from 'chai'

describe('node actions', () => {
  const nodeId = '123'

  describe('nodeTagsUpdated', () => {
    it('should create a nodeTagsUpdated action', () => {
      const updatedTagIds = ['inprogress', 'nextweek']
      const result = nodeActions.nodeTagsUpdated(nodeId, updatedTagIds)

      expect(result).to.deep.equal({
        type: nodeActions.NODE_TAGS_UPDATED,
        nodeId,
        payload: { updatedTagIds }
      })
    })
  })
})
