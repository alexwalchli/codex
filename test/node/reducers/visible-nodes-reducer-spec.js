import { visibleNodes } from '../../../src/js/node/reducers/visible-nodes-reducer'
import * as nodeActions from '../../../src/js/node/actions/node-actions'
import { expect } from 'chai'
import * as I from 'immutable'

describe('visibleNodesReducer', () => {
  const state = I.fromJS({
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true
  })
  const initialTreeState = I.fromJS({
    '1': { id: '1', parentId: undefined, childIds: [ '2', '3', '5' ] },
    '2': { id: '2', parentId: '1', childIds: [], collapsedBy: {} },
    '3': { id: '3', parentId: '1', childIds: [ '4' ], collapsedBy: {} },
    '4': { id: '4', parentId: '3', childIds: [ '5' ], collapsedBy: { 'user123': true } },
    '5': { id: '5', parentId: '4', childIds: [], collapsedBy: {} },
    '6': { id: '6', parentId: '1', childIds: [], collapsedBy: {}, deleted: true }
  })
  describe('INITIAL_TREE_STATE_LOAD', () => {
    it('should set deleted nodes to not visible', () => {
      const initialTreeStateAction = nodeActions.initialTreeStateLoad('1', initialTreeState, 'user123')

      const newState = visibleNodes(state, initialTreeStateAction)

      expect(newState.get('6')).to.equal(false)
    })
    it('should set descendants of collapsed nodes by the current user to not visible', () => {
      const initialTreeStateAction = nodeActions.initialTreeStateLoad('1', initialTreeState, 'user123')

      const newState = visibleNodes(state, initialTreeStateAction)

      expect(newState.get('5')).to.equal(false)
    })
    it('should set nodes that are not deleted nor under a collapsed node to visible', () => {
      const initialTreeStateAction = nodeActions.initialTreeStateLoad('1', initialTreeState, 'user123')

      const newState = visibleNodes(state, initialTreeStateAction)

      expect(newState.get('1')).to.equal(true)
      expect(newState.get('2')).to.equal(true)
      expect(newState.get('3')).to.equal(true)
      expect(newState.get('4')).to.equal(true)
      expect(newState.get('5')).to.equal(false)
      expect(newState.get('6')).to.equal(false)
    })
  })
  describe('NODE_CREATION', () => {
    it('should set the node to visible', () => {
      const nodeCreationAction = nodeActions.nodeCreation('6')

      const newState = visibleNodes(state, nodeCreationAction)

      expect(newState).to.deep.equal(I.Map({
        '1': true,
        '2': true,
        '3': true,
        '4': true,
        '5': true,
        '6': true
      }))
    })
  })
  describe('NODE_COLLAPSE', () => {
    it('should set all descendants to not visible', () => {
      const nodeCollapseAction = nodeActions.nodeCollapse('2', [ '3', '4', '5' ], 'user123')

      const newState = visibleNodes(state, nodeCollapseAction)

      expect(newState).to.deep.equal(I.Map({
        '1': true,
        '2': true,
        '3': false,
        '4': false,
        '5': false
      }))
    })
  })
  describe('NODE_EXPANSION', () => {
    it('should set all uncollapsedDescendantIds to visible', () => {
      const state = I.Map({
        '1': true,
        '2': true,
        '3': false,
        '4': false,
        '5': false
      })
      const nodeExpansionAction = nodeActions.nodeExpansion('2', [ '3', '4', '5' ], [ '3' ])

      const newState = visibleNodes(state, nodeExpansionAction)

      expect(newState).to.deep.equal(I.Map({
        '1': true,
        '2': true,
        '3': true,
        '4': false,
        '5': false
      }))
    })
  })
  describe('NODE_DELETION', () => {
    it('should set the deleted node and all its descendants to not visible', () => {
      const nodeDeletionAction = nodeActions.nodeDeletion('3', '2', [ '4', '5' ], 'user123')

      const newState = visibleNodes(state, nodeDeletionAction)

      expect(newState).to.deep.equal(I.Map({
        '1': true,
        '2': true,
        '3': false,
        '4': false,
        '5': false
      }))
    })
  })
})
