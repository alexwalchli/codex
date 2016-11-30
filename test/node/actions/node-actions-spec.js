import * as nodeActions from '../../../src/js/node/actions/node-actions'
import * as nodeActionTypes from '../../../src/js/node/actions/node-action-types'
import { expect } from 'chai'

describe('node actions', () => {
  describe('initialTreeStateLoad', () => {
    it('should create a initialTreeStateLoad action', () => {
      expect(nodeActions.initialTreeStateLoad('1', {
        initialState: {}
      }, 'user123'))
      .to.deep.equal({
        type: nodeActionTypes.INITIAL_TREE_STATE_LOAD,
        payload: {
          rootNodeId: '1',
          initialTreeState: { initialState: {} },
          userId: 'user123'
        }
      })
    })
  })
  describe('nodeCreation', () => {
    it('should create a nodeCreation action', () => {
      const nodeId = '2'
      const originNodeId = '1'
      const parentId = '1'
      const nodeIdsToDeselect = [ '4', '5' ]
      const originOffset = 1
      const content = 'some content'
      const userPageId = '123'
      const userId = 'user123'

      expect(nodeActions.nodeCreation(nodeId, originNodeId, parentId, nodeIdsToDeselect, parentId, originOffset, content, userPageId, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_CREATION,
          payload: {
            nodeId,
            originNodeId,
            parentId,
            nodeIdsToDeselect,
            nodeIdToUnfocus: parentId,
            originOffset,
            content,
            userPageId,
            userId
          }
        })
    })
  })
  describe('nodeContentUpdate', () => {
    it('should create a nodeContentUpdate action', () => {
      const nodeId = '2'
      const content = 'some content'
      const userId = 'user123'

      expect(nodeActions.nodeContentUpdate(nodeId, content, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_CONTENT_UPDATE,
          payload: {
            nodeId,
            content,
            userId
          }
        })
    })
  })
  describe('nodeNotesUpdate', () => {
    it('should create a nodeNotesUpdate action', () => {
      const nodeId = '2'
      const notes = 'some notes'
      const userId = 'user123'

      expect(nodeActions.nodeNotesUpdate(nodeId, notes, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_NOTES_UPDATE,
          payload: {
            nodeId,
            notes,
            userId
          }
        })
    })
  })
  describe('nodeFocus', () => {
    it('should create a nodeFocus action', () => {
      const nodeId = '2'
      const focusNotes = true
      const userId = 'user123'

      expect(nodeActions.nodeFocus(nodeId, focusNotes, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_FOCUS,
          undoable: false,
          payload: {
            nodeId,
            focusNotes
          }
        })
    })
  })
  describe('nodeUnfocus', () => {
    it('should create a nodeUnfocus action', () => {
      const nodeId = '2'

      expect(nodeActions.nodeUnfocus(nodeId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_UNFOCUS,
          undoable: false,
          payload: {
            nodeId
          }
        })
    })
  })
  describe('nodeDemotion', () => {
    it('should create a nodeDemotion action', () => {
      const nodeId = '2'
      const rootNodeId = '0'
      const visibleNodes = {}
      const userId = 'user123'

      expect(nodeActions.nodeDemotion(nodeId, rootNodeId, visibleNodes, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_DEMOTION,
          payload: {
            nodeId,
            rootNodeId,
            visibleNodes,
            userId
          }
        })
    })
  })
  describe('nodePromotion', () => {
    it('should create a nodePromotion action', () => {
      const nodeId = '2'
      const siblingIds = [ '3', '4' ]
      const currentParentId = '1'
      const newParentId = '0'
      const visibleNodes = {}
      const userId = 'user123'

      expect(nodeActions.nodePromotion(nodeId, siblingIds, currentParentId, newParentId, visibleNodes, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_PROMOTION,
          payload: {
            nodeId,
            siblingIds,
            currentParentId,
            newParentId,
            visibleNodes,
            userId
          }
        })
    })
  })
  describe('nodeExpansionToggle', () => {
    it('should create a nodeExpansionToggle action', () => {
      const nodeId = '2'
      const forceToggleChildrenExpansion = true
      const userId = 'user123'

      expect(nodeActions.nodeExpansionToggle(nodeId, forceToggleChildrenExpansion, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_EXPANSION_TOGGLE,
          payload: {
            nodeId,
            forceToggleChildrenExpansion,
            userId
          }
        })
    })
  })
  describe('nodeSelection', () => {
    it('should create a nodeSelection action', () => {
      const nodeId = '2'

      expect(nodeActions.nodeSelection(nodeId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_SELECTION,
          payload: {
            nodeId
          }
        })
    })
  })
  describe('nodeDeselection', () => {
    it('should create a nodeDeselection action', () => {
      const nodeId = '2'

      expect(nodeActions.nodeDeselection(nodeId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_DESELECTION,
          payload: {
            nodeId
          }
        })
    })
  })
  describe('nodeCompletionToggle', () => {
    it('should create a nodeCompletionToggle action', () => {
      const nodeId = '2'
      const userId = 'user123'

      expect(nodeActions.nodeCompletionToggle(nodeId, userId))
        .to.deep.equal({
          type: nodeActionTypes.NODE_COMPLETION_TOGGLE,
          payload: {
            nodeId,
            userId
          }
        })
    })
  })
})

