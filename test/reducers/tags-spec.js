import * as tagActions from '../../src/js/actions/tags'
import { INITIAL_NODE_STATE_LOADED } from '../../src/js/actions/firebase'
import * as tagsReducer from '../../src/js/reducers/tags'
import { expect } from 'chai'

describe('tags reducer', () => {
  const initialTagsState = [
    {
      id: 'inprogress',
      label: 'InProgress'
    },
    {
      id: 'todo',
      label: 'ToDo'
    },
    {
      id: 'learning',
      label: 'Learning'
    }
  ]
  const initialNodeStateLoaded = {
    type: INITIAL_NODE_STATE_LOADED,
    payload: {
      rootNodeId: '1',
      initialTagsState,
      userId: '09876'
    }
  }

  describe('INITIAL_NODE_STATE_LOADED', () => {
    it('should initialize tags state', () => {
      const newState = tagsReducer.tags({}, initialNodeStateLoaded)

      expect(newState).to.deep.equal(initialTagsState)
    })
  })

  describe('TAG_CREATED', () => {
    it('should add the tag to state', () => {
      const initialState = tagsReducer.tags({}, initialNodeStateLoaded)
      const newState = tagsReducer.tags(initialState, tagActions.tagCreated('reading', 'reading'))

      expect(newState).to.deep.equal([
        {
          id: 'inprogress',
          label: 'InProgress'
        },
        {
          id: 'todo',
          label: 'ToDo'
        },
        {
          id: 'learning',
          label: 'Learning'
        },
        {
          id: 'reading',
          label: 'reading'
        }
      ])
    })
  })
})
