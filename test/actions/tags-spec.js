// import * as firebaseTagActions from '../../../src/js/actions/firebase/firebase-tag-actions'
import * as tagActions from '../../src/js/actions/tags'
import * as nodeActions from '../../src/js/actions/node/node-thunks'
import sinon from 'sinon'
import { expect } from 'chai'

describe('tags action', () => {
  let getState
  let dispatch
  let userId = 111
  const addTagToNodeActionCreatorStub = {}
  sinon.stub(nodeActions, 'addTagToNode', () => (addTagToNodeActionCreatorStub))

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
      tagActions.createTag('#', 'todo', 'ToDo', '123')(dispatch, getState)
      expect(dispatch).to.not.have.been.called
    })

    it('should dispatch a tagCreated and a addTagToNode', () => {
      tagActions.createTag('#', 'newtag', 'New Tag', '123')(dispatch, getState)

      expect(dispatch).to.have.been.calledWith(tagActions.tagCreated('#', 'newtag', 'New Tag'))
      expect(dispatch).to.have.been.calledWith(addTagToNodeActionCreatorStub)
    })
  })

  describe('tagCreated', () => {
    it('should create a proper tag created action', () => {
      const tagCreatedAction = tagActions.tagCreated('#', 'newtag', 'New Tag')

      expect(tagCreatedAction).to.deep.equal({
        type: tagActions.TAG_CREATED,
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

