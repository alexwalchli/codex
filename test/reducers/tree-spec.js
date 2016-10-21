import * as nodeActions from '../../src/js/actions/node/node-actions'
import { INITIAL_NODE_STATE_LOADED } from '../../src/js/actions/firebase'
import * as treeReducer from '../../src/js/reducers/tree'
import nodeFactory from '../../src/js/utilities/node-factory'
import { describe, it } from 'mocha'
import { expect } from 'chai'

describe('tree reducer', () => {
  const treeState = {
    '1': { id: '1', childIds: ['123', '321'] },
    '123': {
      id: '123',
      parentId: '1',
      childIds: [],
      collapsed: true,
      completed: true
    },
    '321': {
      id: '321',
      parentId: '1',
      childIds: [],
      collapsed: false,
      completed: true
    }
  }
  const userId = '09876'

  describe('INITIAL_NODE_STATE_LOADED', () => {
    it('INITIAL_NODE_STATE_LOADED should assign the payload as the state', () => {
      const initialNodeState = { tree: {} }
      const initialNodeStateLoaded = {
        type: INITIAL_NODE_STATE_LOADED,
        payload: initialNodeState
      }

      const newTreeState = treeReducer.tree({}, initialNodeStateLoaded)

      expect(newTreeState).toEqual(initialNodeState)
    })
  })

  describe('NODE_CREATED', () => {
    it('NODE_CREATED should add the new node to state', () => {
      const newNodeId = '111'
      const parentId = '123'
      const childIds = []
      const content = 'some content'
      const action = nodeActions.nodeCreated(nodeFactory(newNodeId, parentId, childIds, content, userId))

      const newTreeState = treeReducer.tree(treeState, action)

      expect(newTreeState['111'].id).toEqual(newNodeId)
      expect(newTreeState['111'].parentId).toEqual(parentId)
      expect(newTreeState['111'].childIds).toEqual(childIds)
      expect(newTreeState['111'].content).toEqual(content)
    })
  })

  describe('NODES_DELETED', () => {
    it('NODES_DELETED should set each node as deleted, not visisble and not selected', () => {
      const nodeIds = ['123', '321']
      const action = nodeActions.nodesDeleted(nodeIds)

      const newTreeState = treeReducer.tree(treeState, action)

      expect(newTreeState['123'].deleted).toEqual(true)
      expect(newTreeState['123'].visible).toEqual(false)
      expect(newTreeState['123'].selected).toEqual(false)
      expect(newTreeState['321'].deleted).toEqual(true)
      expect(newTreeState['321'].visible).toEqual(false)
      expect(newTreeState['321'].selected).toEqual(false)
    })
  })
})
