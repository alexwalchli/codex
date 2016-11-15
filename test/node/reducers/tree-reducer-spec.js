import * as nodeActions from '../../../src/js/node/actions/node-actions'
import { INITIAL_NODE_STATE_LOADED } from '../../../src/js/node/actions/node-action-types'
import * as treeReducer from '../../../src/js/node/reducers/tree-reducer'
import nodeFactory from '../../../src/js/node/helpers/node-factory'
import { expect } from 'chai'

describe('tree reducer', () => {
  const userId = '09876'
  const treeState = {
    '1': { id: '1', childIds: ['123', '321'] },
    '123': {
      id: '123',
      parentId: '1',
      childIds: [],
      collapsedBy: { '09876': true },
      completed: true,
      taggedByIds: []
    },
    '321': {
      id: '321',
      parentId: '1',
      childIds: [],
      collapsedBy: {},
      completed: true,
      taggedByIds: []
    }
  }

  describe('INITIAL_NODE_STATE_LOADED', () => {
    it('INITIAL_NODE_STATE_LOADED should assign the payload as the state', () => {
      const initialTreeState = treeState
      const initialNodeStateLoaded = {
        type: INITIAL_NODE_STATE_LOADED,
        payload: {
          rootNodeId: '1',
          initialTreeState
        }
      }

      const newTreeState = treeReducer.tree({}, initialNodeStateLoaded)

      expect(newTreeState).to.deep.equal({
        '1': { id: '1', childIds: ['123', '321'] },
        '123': {
          id: '123',
          parentId: '1',
          childIds: [],
          focused: true,
          notesFocused: false,
          collapsedBy: { '09876': true },
          completed: true,
          taggedByIds: []
        },
        '321': {
          id: '321',
          parentId: '1',
          childIds: [],
          collapsedBy: {},
          completed: true,
          taggedByIds: []
        }
      })
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

      expect(newTreeState['111'].id).to.equal(newNodeId)
      expect(newTreeState['111'].parentId).to.equal(parentId)
      expect(newTreeState['111'].childIds).to.equal(childIds)
      expect(newTreeState['111'].content).to.equal(content)
    })
  })

  describe('NODES_DELETED', () => {
    it('NODES_DELETED should set each node as deleted, not visisble and not selected', () => {
      const nodeIds = ['123', '321']
      const action = nodeActions.nodesDeleted(nodeIds)

      const newTreeState = treeReducer.tree(treeState, action)

      expect(newTreeState['123'].deleted).to.equal(true)
      expect(newTreeState['123'].visible).to.equal(false)
      expect(newTreeState['123'].selected).to.equal(false)
      expect(newTreeState['321'].deleted).to.equal(true)
      expect(newTreeState['321'].visible).to.equal(false)
      expect(newTreeState['321'].selected).to.equal(false)
    })
  })

  describe('NODE_TAGS_UPDATED', () => {
    it('NODE_TAGS_UPDATED should set the nodes tags', () => {
      const nodeId = '123'
      const tagIds = [ 'inprogress', 'learning' ]
      const action = nodeActions.nodeTagsUpdated(nodeId, tagIds)

      const newTreeState = treeReducer.tree(treeState, action)

      expect(newTreeState['123'].taggedByIds).to.deep.equal(tagIds)
    })
  })

  describe('TAG_ADDED', () => {
    it('should add the tag to the node state', () => {
      const nodeId = '123'
      const action = nodeActions.tagAdded(nodeId, 'inprogress')

      const newTreeState = treeReducer.tree(treeState, action)

      expect(newTreeState['123'].taggedByIds).to.deep.equal(['inprogress'])
    })
  })

  describe('TAG_REMOVED', () => {
    it('should remove the tag from node state', () => {
      const nodeId = '123'
      let newTreeState = treeState
      const addInProgressTagAction = nodeActions.tagAdded(nodeId, 'inprogress')
      newTreeState = treeReducer.tree(newTreeState, addInProgressTagAction)
      const addLearningTagAction = nodeActions.tagAdded(nodeId, 'learning')
      newTreeState = treeReducer.tree(newTreeState, addLearningTagAction)

      const action = nodeActions.tagRemoved(nodeId, 'learning')

      newTreeState = treeReducer.tree(newTreeState, action)

      expect(newTreeState[nodeId].taggedByIds).to.deep.equal(['inprogress'])
    })
  })
})
