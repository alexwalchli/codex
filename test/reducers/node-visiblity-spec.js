// import * as nodeActions from '../../src/js/node/actions/node-actions'
// import { INITIAL_NODE_STATE_LOADED } from '../../src/js/node/actions/node-action-types'
// import * as visibleNodesReducer from '../../src/js/node/reducers/visible-nodes-reducer'
// import { expect } from 'chai'

// describe('node visibility reducer', () => {
//   const initialTreeState = {
//     '1': { id: '1', childIds: ['123', '321'] },
//     '123': {
//       id: '123',
//       parentId: '1',
//       childIds: ['456', '789'],
//       collapsedBy: { '09876': true },
//       completed: true
//     },
//     '321': {
//       id: '321',
//       parentId: '1',
//       childIds: [],
//       collapsedBy: {},
//       completed: true,
//       deleted: false
//     },
//     '456': {
//       id: '456',
//       parentId: '123',
//       childIds: [],
//       collapsedBy: {},
//       completed: true,
//       deleted: false
//     },
//     '789': {
//       id: '789',
//       parentId: '123',
//       childIds: [],
//       collapsedBy: {},
//       completed: true,
//       deleted: false
//     }
//   }
//   const initialNodeStateLoaded = {
//     type: INITIAL_NODE_STATE_LOADED,
//     payload: {
//       rootNodeId: '1',
//       initialTreeState,
//       userId: '09876'
//     }
//   }

//   describe('INITIAL_NODE_STATE_LOADED', () => {
//     it('should initialize state and set nodes to hidden that are deleted', () => {
//       const newState = visibleNodesReducer.visibleNodes({}, initialNodeStateLoaded)

//       expect(newState).to.deep.equal({
//         '1': true,
//         '123': true,
//         '321': true,
//         '456': false,
//         '789': false
//       })
//     })
//   })

//   describe('NODE_COLLAPSED', () => {
//     it('should set the all descendants to hidden', () => {
//       const initialState = visibleNodesReducer.visibleNodes({}, initialNodeStateLoaded)
//       const newState = visibleNodesReducer.visibleNodes(initialState, nodeActions.nodeCollapsed('123', ['456', '789'], '09876'))

//       expect(newState).to.deep.equal({
//         '1': true,
//         '123': true,
//         '321': true,
//         '456': false,
//         '789': false
//       })
//     })
//   })

//   describe('NODE_EXPANDED', () => {
//     it('should make all descedants visible', () => {
//       const initialState = visibleNodesReducer.visibleNodes({}, initialNodeStateLoaded)
//       const newState = visibleNodesReducer.visibleNodes(initialState, nodeActions.nodeExpanded('123', ['456', '789'], '09876'))

//       expect(newState).to.deep.equal({
//         '1': true,
//         '123': true,
//         '321': true,
//         '456': true,
//         '789': true
//       })
//     })
//   })

//   describe('NODES_DELETED', () => {
//     it('should all deleted nodes to hidden', () => {
//       const initialState = visibleNodesReducer.visibleNodes({}, initialNodeStateLoaded)
//       const newState = visibleNodesReducer.visibleNodes(initialState, nodeActions.nodesDeleted(['456', '789']))

//       expect(newState).to.deep.equal({
//         '1': true,
//         '123': true,
//         '321': true,
//         '456': false,
//         '789': false
//       })
//     })
//   })

//   describe('NODE_CREATED', () => {
//     it('should add the node and set to visible', () => {
//       const initialState = visibleNodesReducer.visibleNodes({}, initialNodeStateLoaded)
//       const newState = visibleNodesReducer.visibleNodes(
//         initialState,
//         nodeActions.nodeCreated({ id: '1011' })
//       )

//       expect(newState).to.deep.equal({
//         '1': true,
//         '123': true,
//         '321': true,
//         '456': false,
//         '789': false,
//         '1011': true
//       })
//     })
//   })
// })
