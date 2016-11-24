import * as nodeOperations from '../../../src/js/node/operations/node-operations'
import { expect } from 'chai'

describe('nodeOperations', () => {
  const dummyState = {
    '1': { id: '1', parentId: undefined, childIds: [ '2', '3', '4', '5' ] },
    '2': { id: '2', parentId: '1', childIds: [], focused: true },
    '3': { id: '3', parentId: '1', childIds: [ '4' ] },
    '4': { id: '4', parentId: '3', childIds: [], selected: true },
    '5': { id: '5', parentId: '1', childIds: [] }
  }

  const dummyNode = { id: '2', parentId: '1', childIds: [ '3', '4' ] }

  describe('create', () => {
    it('should return a node with initialized values', () => {
      const nodeId = '123'
      const parentId = '1'
      const childIds = ['4', '5']
      const content = 'some content'
      const createdById = 'abc123'
      expect(nodeOperations.create(nodeId, parentId, childIds, content, createdById))
        .to.deep.equal({
          id: nodeId,
          parentId,
          childIds,
          content,
          createdById,
          visible: true,
          collapsedBy: {},
          taggedByIds: []
        })
    })
  })
  describe('addChild', () => {
    const parentNode = {
      id: '1',
      childIds: [ '2', '3', '4' ]
    }

    it('should not add a duplicate', () => {
      expect(nodeOperations.addChild(parentNode, '2', parentNode.id, 1).childIds).to.deep.equal(parentNode.childIds)
    })
    it('should insert child ID based on originNodeId and originOffset', () => {
      expect(nodeOperations.addChild(parentNode, '5', '2', 1).childIds).to.deep.equal([ '2', '5', '3', '4' ])
      expect(nodeOperations.addChild(parentNode, '5', '3', 1).childIds).to.deep.equal([ '2', '3', '5', '4' ])
      expect(nodeOperations.addChild(parentNode, '5', '4', 1).childIds).to.deep.equal([ '2', '3', '4', '5' ])
    })
    it('should prepend child ID if no originNodeId or originOffset is specified', () => {
      expect(nodeOperations.addChild(parentNode, '5').childIds).to.deep.equal([ '5', '2', '3', '4' ])
    })
    it('should set updatedById', () => {
      expect(nodeOperations.addChild(parentNode, '5', null, null, 'abc').updatedById).to.deep.equal('abc')
    })
  })
  describe('removeChild', () => {
    it('should remove the child ID from childIds', () => {
      expect(nodeOperations.removeChild(dummyNode, '4', 'user123')).to.deep.equal({
        id: '2', parentId: '1', childIds: [ '3' ], updatedById: 'user123'
      })
    })
  })
  describe('updateParent', () => {
    it('should set to the new parent ID', () => {
      expect(nodeOperations.updateParent(dummyNode, '1111', 'user123')).to.deep.equal({
        id: '2', parentId: '1111', childIds: [ '3', '4' ], updatedById: 'user123'
      })
    })
  })
  describe('updateContent', () => {
    it('should set content to the new content', () => {
      expect(nodeOperations.updateContent(dummyNode, 'some content')).to.deep.equal({
        id: '2', parentId: '1', childIds: [ '3', '4' ], content: 'some content'
      })
    })
  })
  describe('deselect', () => {
    it('should set selected to false', () => {
      expect(nodeOperations.deselect(dummyNode)).to.deep.equal({
        id: '2', parentId: '1', childIds: [ '3', '4' ], selected: false
      })
    })
  })
  describe('select', () => {
    it('should set selected to true', () => {
      expect(nodeOperations.select(dummyNode)).to.deep.equal({
        id: '2', parentId: '1', childIds: [ '3', '4' ], selected: true
      })
    })
  })
  describe('focus', () => {
    it('should set focused to true and notesFocused to false', () => {
      expect(nodeOperations.focus(dummyState, '3', false)['3']).to.deep.equal({
        id: '3', parentId: '1', childIds: [ '4' ], focused: true, notesFocused: false
      })
    })
    it('should set focused to false and notesFocused to true when focusNotes true', () => {
      expect(nodeOperations.focus(dummyState, '3', true)['3']).to.deep.equal({
        id: '3', parentId: '1', childIds: [ '4' ], focused: false, notesFocused: true
      })
    })
    it('should unfocus the currently focused node and deselect all nodes', () => {
      const newState = nodeOperations.focus(dummyState, '3', false)
      expect(newState['2'].focused).to.equal(false)
      expect(newState['4'].selected).to.equal(false)
    })
  })
  describe('unfocus', () => {
    it('should set focused and notesFocused to false', () => {
      expect(nodeOperations.unfocus(dummyNode)).to.deep.equal({
        id: '2', parentId: '1', childIds: [ '3', '4' ], focused: false, notesFocused: false
      })
    })
  })
  describe('reassignParent', () => {
    it('should remove the node from its current parent, update its parent ID to the new parent, and add the node to its new parent', () => {
      const state = {
        '1': { id: '1', parentId: undefined, childIds: [ '2', '3', '4', '5' ] },
        '2': { id: '2', parentId: '1', childIds: [] },
        '3': { id: '3', parentId: '1', childIds: [ '4' ] },
        '4': { id: '4', parentId: '3', childIds: [] },
        '5': { id: '5', parentId: '1', childIds: [] }
      }

      const newState = nodeOperations.reassignParent(state, '5', '1', '3', '4', 'user123')

      expect(newState).to.deep.equal({
        '1': { id: '1', parentId: undefined, childIds: [ '2', '3', '4' ], updatedById: 'user123' },
        '2': { id: '2', parentId: '1', childIds: [] },
        '3': { id: '3', parentId: '1', childIds: [ '4', '5' ], updatedById: 'user123' },
        '4': { id: '4', parentId: '3', childIds: [] },
        '5': { id: '5', parentId: '3', childIds: [], updatedById: 'user123' }
      })
    })
  })
})
