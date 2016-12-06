import * as nodeOperations from '../../../src/js/node/operations/node-operations'
import { expect } from 'chai'
import * as I from 'immutable'
import { NodeRecord } from '../../../src/js/node/node-record'

describe('nodeOperations', () => {
  const dummyState = I.Map({
    '1': new NodeRecord({ id: '1', parentId: undefined, childIds: I.List([ '2', '3', '4', '5' ]) }),
    '2': new NodeRecord({ id: '2', parentId: '1', childIds: I.List([]), focused: true }),
    '3': new NodeRecord({ id: '3', parentId: '1', childIds: I.List([ '4' ]) }),
    '4': new NodeRecord({ id: '4', parentId: '3', childIds: I.List([]), selected: true }),
    '5': new NodeRecord({ id: '5', parentId: '1', childIds: I.List([]) })
  })

  const dummyNode = new NodeRecord({ id: '2', parentId: '1', childIds: I.List.of('3', '4') })

  describe('create', () => {
    it('should return a node with initialized values', () => {
      const nodeId = '123'
      const parentId = '1'
      const childIds = I.List(['4', '5'])
      const content = 'some content'
      const createdById = 'abc123'
      expect(nodeOperations.makeNode(nodeId, parentId, childIds, content, createdById))
        .to.deep.equal(new NodeRecord({
          id: nodeId, parentId, childIds, content, createdById
        }))
    })
  })
  describe('addChild', () => {
    const parentNode = I.Map({
      id: '1',
      childIds: I.List.of('2', '3', '4')
    })

    it('should not add a duplicate', () => {
      expect(nodeOperations.addChild(parentNode, '2', parentNode.id, 1).childIds).to.deep.equal(parentNode.childIds)
    })
    it('should insert child ID based on originNodeId and originOffset', () => {
      expect(nodeOperations.addChild(parentNode, '5', '2', 1, 'user123').get('childIds').toJS()).to.deep.equal([ '2', '5', '3', '4' ])
      expect(nodeOperations.addChild(parentNode, '5', '3', 1, 'user123').get('childIds').toJS()).to.deep.equal([ '2', '3', '5', '4' ])
      expect(nodeOperations.addChild(parentNode, '5', '4', 1, 'user123').get('childIds').toJS()).to.deep.equal([ '2', '3', '4', '5' ])
    })
    it('should prepend child ID if no originNodeId or originOffset is specified', () => {
      expect(nodeOperations.addChild(parentNode, '5').toJS().childIds).to.deep.equal([ '5', '2', '3', '4' ])
    })
    it('should set lastUpdatedById', () => {
      expect(nodeOperations.addChild(parentNode, '5', null, null, 'abc').get('lastUpdatedById')).to.deep.equal('abc')
    })
  })
  describe('removeChild', () => {
    it('should remove the child ID from childIds', () => {
      expect(nodeOperations.removeChild(dummyNode, '4', 'user123')).to.equal(
        new NodeRecord({ id: '2', parentId: '1', childIds: I.List([ '3' ]), lastUpdatedById: 'user123' })
      )
    })
  })
  describe('updateParent', () => {
    it('should set to the new parent ID', () => {
      expect(nodeOperations.updateParent(dummyNode, '1111', 'user123')).to.equal(
        new NodeRecord({ id: '2', parentId: '1111', childIds: I.List([ '3', '4' ]), lastUpdatedById: 'user123' })
      )
    })
  })
  describe('updateContent', () => {
    it('should set content to the new content', () => {
      expect(nodeOperations.updateContent(dummyNode, 'some content', 'user123')).to.equal(
        new NodeRecord({ id: '2', parentId: '1', childIds: I.List([ '3', '4' ]), content: 'some content', lastUpdatedById: 'user123' })
      )
    })
  })
  describe('updateNotes', () => {
    it('should set notes to the new notes', () => {
      expect(nodeOperations.updateNotes(dummyNode, 'some notes', 'user123')).to.equal(
        new NodeRecord({ id: '2', parentId: '1', childIds: I.List([ '3', '4' ]), content: '', notes: 'some notes', lastUpdatedById: 'user123' })
      )
    })
  })
  describe('deleteNode', () => {
    it('should set node to deleted, unselected, unfocused, and removed from parent', () => {
      const parentId = '1'
      const nodeId = '2'
      const userId = 'user123'
      const newState = nodeOperations.deleteNode(dummyState, nodeId, parentId, userId)

      expect(newState.get(parentId).get('childIds')).to.equal(I.List.of('3', '4', '5'))
      expect(newState.get(parentId).get('lastUpdatedById')).to.equal(userId)
      expect(newState.get(nodeId).get('deleted')).to.equal(true)
      expect(newState.get(nodeId).get('selected')).to.equal(false)
      expect(newState.get(nodeId).get('lastUpdatedById')).to.equal(userId)
    })
  })
  describe('deselect', () => {
    it('should set selected to false on all nodes', () => {
      const newState = nodeOperations.deselect(dummyState, ['2', '3'])
      expect(newState.getIn(['2', 'selected'])).to.equal(false)
      expect(newState.getIn(['3', 'selected'])).to.equal(false)
    })
  })
  describe('select', () => {
    it('should set selected to true on all nodes', () => {
      const newState = nodeOperations.select(dummyState, ['2', '3'])
      expect(newState.getIn(['2', 'selected'])).to.equal(true)
      expect(newState.getIn(['3', 'selected'])).to.equal(true)
    })
  })
  describe('focus', () => {
    it('should set focused to true and notesFocused to false', () => {
      const newState = nodeOperations.focus(dummyState, '3', false)
      expect(newState.getIn(['3', 'focused'])).to.equal(true)
    })
    it('should set focused to false and notesFocused to true when focusNotes true', () => {
      const newState = nodeOperations.focus(dummyState, '3', true)
      expect(newState.getIn(['3', 'focused'])).to.equal(false)
      expect(newState.getIn(['3', 'notesFocused'])).to.equal(true)
    })
    it('should unfocus the currently focused node and deselect all nodes', () => {
      const newState = nodeOperations.focus(dummyState, '3', false)
      expect(newState.getIn(['2', 'focused'])).to.equal(false)
      expect(newState.getIn(['4', 'selected'])).to.equal(false)
    })
  })
  describe('unfocus', () => {
    it('should set focused and notesFocused to false', () => {
      expect(nodeOperations.unfocus(dummyNode)).to.equal(dummyNode.merge({ focused: false }))
    })
  })
  describe('complete', () => {
    it('should set node to completed and update last updated', () => {
      expect(nodeOperations.complete(dummyNode, 'user123')).to.equal(dummyNode.merge({ completed: true, lastUpdatedById: 'user123' }))
    })
  })
  describe('expand', () => {
    it('should set all nodes uncollapsed for the user', () => {
      const state = I.Map({
        '1': new NodeRecord({ id: '1', parentId: undefined, childIds: I.List([ '2' ]) }),
        '2': new NodeRecord({ id: '2', parentId: '1', childIds: I.List(['3', '4', '5']), collapsedBy: I.Map({ 'user123': true }) }),
        '3': new NodeRecord({ id: '3', parentId: '2', childIds: I.List([]) }),
        '4': new NodeRecord({ id: '4', parentId: '2', childIds: I.List(['5']), collapsedBy: I.Map({ 'user123': true }) }),
        '5': new NodeRecord({ id: '5', parentId: '4', childIds: I.List([]) })
      })

      const newState = nodeOperations.expand(state, [ '2', '4' ], 'user456')

      expect(newState.getIn(['2', 'collapsedBy'])).to.deep.equal(I.Map({ 'user123': true, 'user456': false }))
      expect(newState.getIn(['4', 'collapsedBy'])).to.deep.equal(I.Map({ 'user123': true, 'user456': false }))
    })
  })
  describe('collapse', () => {
    it('should set all nodes collapsed for the user', () => {
      const state = I.Map({
        '1': new NodeRecord({ id: '1', parentId: undefined, childIds: I.List([ '2' ]) }),
        '2': new NodeRecord({ id: '2', parentId: '1', childIds: I.List(['3', '4', '5']), collapsedBy: I.Map({ 'user123': true }) }),
        '3': new NodeRecord({ id: '3', parentId: '2', childIds: I.List([]) }),
        '4': new NodeRecord({ id: '4', parentId: '2', childIds: I.List(['5']), collapsedBy: I.Map({ 'user123': true }) }),
        '5': new NodeRecord({ id: '5', parentId: '4', childIds: I.List([]) })
      })

      const newState = nodeOperations.collapse(state, [ '2', '4' ], 'user456')

      expect(newState.getIn(['2', 'collapsedBy'])).to.deep.equal(I.Map({ 'user123': true, 'user456': true }))
      expect(newState.getIn(['4', 'collapsedBy'])).to.deep.equal(I.Map({ 'user123': true, 'user456': true }))
    })
  })

  describe('reassignParent', () => {
    it('should remove the node from its current parent, update its parent ID to the new parent, and add the node to its new parent', () => {
      const state = I.Map({
        '1': new NodeRecord({ id: '1', parentId: undefined, childIds: I.List([ '2', '3', '4', '5' ]) }),
        '2': new NodeRecord({ id: '2', parentId: '1', childIds: I.List([]) }),
        '3': new NodeRecord({ id: '3', parentId: '1', childIds: I.List([ '4' ]) }),
        '4': new NodeRecord({ id: '4', parentId: '3', childIds: I.List([]) }),
        '5': new NodeRecord({ id: '5', parentId: '1', childIds: I.List([]) })
      })

      const newState = nodeOperations.reassignParent(state, '5', '1', '3', '4', 'user123')

      expect(newState).to.deep.equal(I.Map({
        '1': new NodeRecord({ id: '1', parentId: undefined, childIds: I.List([ '2', '3', '4' ]), lastUpdatedById: 'user123' }),
        '2': new NodeRecord({ id: '2', parentId: '1', childIds: I.List([]) }),
        '3': new NodeRecord({ id: '3', parentId: '1', childIds: I.List([ '4', '5' ]), lastUpdatedById: 'user123' }),
        '4': new NodeRecord({ id: '4', parentId: '3', childIds: I.List([]) }),
        '5': new NodeRecord({ id: '5', parentId: '3', childIds: I.List([]), lastUpdatedById: 'user123' })
      }))
    })
  })
})
