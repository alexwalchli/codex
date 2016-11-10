import * as tagActionCreators from '../../src/js/tag/actions/tag-action-creators'
import * as tagActions from '../../src/js/tag/actions/tag-actions'
import * as nodeActionCreators from '../../src/js/node/actions/node-action-creators'
import sinon from 'sinon'
import { expect } from 'chai'

describe('tag action creators', () => {
  let getState
  let dispatch
  let userId = 111
  const addTagToNodeActionCreatorStub = {}
  sinon.stub(nodeActionCreators, 'addTagToNode', () => (addTagToNodeActionCreatorStub))

  beforeEach(() => {
    getState = () => {
      return {
        tags: [
          {
            id: 'inprogress',
            label: 'InProgress'
          },
          {
            id: 'todo',
            label: 'ToDo'
          }
        ],
        auth: { id: userId }
      }
    }
    dispatch = sinon.spy()
  })

  describe('createTag', () => {
    it('should not create a duplicate tag', () => {
      tagActionCreators.createTag('#', 'todo', 'ToDo', '123')(dispatch, getState)
      expect(dispatch).to.not.have.been.called
    })

    it('should dispatch a tagCreated and a addTagToNode', () => {
      tagActionCreators.createTag('#', 'newtag', 'New Tag', '123')(dispatch, getState)

      expect(dispatch).to.have.been.calledWith(tagActions.tagCreated('#', 'newtag', 'New Tag'))
      expect(dispatch).to.have.been.calledWith(addTagToNodeActionCreatorStub)
    })
  })
})
