// import * as nodeActions from '../../../src/js/node/actions/node-actions'
import { INITIAL_TREE_STATE_LOAD, NODE_CREATION } from '../../../src/js/node/actions/node-action-types'
import { tree } from '../../../src/js/node/reducers/tree-reducer'
import * as nodeOperations from '../../../src/js/node/operations/node-operations'
import * as nodeSelectors from '../../../src/js/node/selectors/node-selectors'
import { expect } from 'chai'
import sinon from 'sinon'

describe('treeReducer', () => {
  beforeEach(() => {
    sinon.spy(nodeOperations, 'focus')
    sinon.spy(nodeOperations, 'addChild')
    sinon.spy(nodeOperations, 'create')
    sinon.spy(nodeSelectors, 'getCurrentlySelectedNodeIds')
    sinon.spy(nodeSelectors, 'getCurrentlyFocusedNodeId')
  })

  afterEach(() => {
    nodeOperations.focus.restore()
    nodeOperations.addChild.restore()
    nodeOperations.create.restore()
    nodeSelectors.getCurrentlySelectedNodeIds.restore()
    nodeSelectors.getCurrentlyFocusedNodeId.restore()
  })

  describe('INITIAL_TREE_STATE_LOAD', () => {
    const payload = {
      rootNodeId: '123',
      initialTreeState: {
        '123': { id: '123', childIds: [ '456' ] },
        '456': { id: '456', parentId: '123' }
      }
    }

    it('should set the state to the initial tree state', () => {
      const initialTreeStateLoadedAction = {
        type: INITIAL_TREE_STATE_LOAD,
        payload
      }
      const newState = tree(null, initialTreeStateLoadedAction)

      expect(newState).to.deep.equal({
        '123': { id: '123', childIds: [ '456' ] },
        '456': { id: '456', parentId: '123', focused: true }
      })
    })
    it('should focus the first child of the root node', () => {
      const initialTreeStateLoadedAction = {
        type: INITIAL_TREE_STATE_LOAD,
        payload
      }

      tree(null, initialTreeStateLoadedAction)

      expect(nodeOperations.focus).to.have.been.calledWith(payload.initialTreeState['456'])
    })
  })
  describe('NODE_CREATION', () => {
    const state = {
      '1': { id: '1', childIds: [ '2', '3', '4' ] },
      '2': { id: '2', parentId: '1', childIds: [ '2a', '2b' ] },
      '2a': { id: '2a', parentId: '2', childIds: [] },
      '2b': { id: '2b', parentId: '2', childIds: [] },
      '3': { id: '3', parentId: '1', childIds: [] },
      '4': { id: '4', parentId: '1', childIds: [], collapsed: true }
    }

    it('should create the node as a child if the origin node is has children', () => {
      const nodeCreationAction = {
        type: NODE_CREATION,
        payload: {
          nodeId: '1111',
          originNodeId: '2',
          originOffset: 1,
          content: 'some content',
          userPageId: 'abc123',
          userId: 'abc'
        }
      }

      tree(state, nodeCreationAction)

      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '2', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should create the node as a sibling if the currently selected node is not a parent', () => {
      const nodeCreationAction = {
        type: NODE_CREATION,
        payload: {
          nodeId: '1111',
          originNodeId: '3',
          originOffset: 1,
          content: 'some content',
          userPageId: 'abc123',
          userId: 'abc'
        }
      }

      tree(state, nodeCreationAction)

      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '1', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should create the node as a sibling if the currently selected node is collapsed', () => {
      const nodeCreationAction = {
        type: NODE_CREATION,
        payload: {
          nodeId: '1111',
          originNodeId: '4',
          originOffset: 1,
          content: 'some content',
          userPageId: 'abc123',
          userId: 'abc'
        }
      }

      tree(state, nodeCreationAction)

      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '1', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should focus the new node if the originOffset is greater than 0', () => {
      const nodeCreationAction = {
        type: NODE_CREATION,
        payload: {
          nodeId: '1111',
          originNodeId: '4',
          originOffset: 1,
          content: 'some content',
          userPageId: 'abc123',
          userId: 'abc'
        }
      }

      tree(state, nodeCreationAction)

      expect(nodeOperations.focus.firstCall.args[0].id).to.equal(nodeCreationAction.payload.nodeId)
    })
    it('should not focus the new node if the originOffset is equal to or less than 0', () => {
      const nodeCreationAction = {
        type: NODE_CREATION,
        payload: {
          nodeId: '1111',
          originNodeId: '4',
          originOffset: 0,
          content: 'some content',
          userPageId: 'abc123',
          userId: 'abc'
        }
      }

      tree(state, nodeCreationAction)

      expect(nodeOperations.focus).to.not.have.been.called
    })
  })
  // describe('NODE_FOCUS', () => {
  //   it('should set the node to focused', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_UNFOCUS', () => {
  //   it('should set the node to unfocused', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_FOCUS_ABOVE', () => {
  //   it('should get the next node above that is visible and focus it', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_FOCUS_BELOW', () => {
  //   it('should get the next node below that is visible and focus it', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_DEMOTION', () => {
  //   it('should reassign the demoted node parentId to its sibling above', () => {
  //     throw new Error('not impl')
  //   })
  //   it('should focus the demoted node', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_PROMOTION', () => {
  //   it('it should reassign all siblings below to be the promoted nodes children', () => {
  //     throw new Error('not impl')
  //   })
  //   it('should focus the demoted node', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_EXPANSION_TOGGLE', () => {
  //   it('should expand the node and its uncollapsed descendents if it is currently collapsed by the current user', () => {
  //     throw new Error('not impl')
  //   })
  //   it('should collapse the node and its expanded descendents if it is currently collapsed by the current user', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_SELECTION', () => {
  //   it('should select the node and all its descendants', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_DESELECTION', () => {
  //   it('should deselect the node and all its descendants', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_COMPLETION_TOGGLE', () => {
  //   it('should toggle the nodes complete attribute', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODES_COMPLETION', () => {
  //   it('should set all nodes to complete', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_NOTES_UPDATE', () => {
  //   it('should update the node notes', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_DISPLAY_MODE_UPDATE', () => {
  //   it('should update the node display mode', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_TAG_ADDITION', () => {
  //   it('should add the tag to the node if it does not exist', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('NODE_TAG_REMOVAL', () => {
  //   it('should remove the tag from the node', () => {
  //     throw new Error('not impl')
  //   })
  // })
})

// describe('tree reducer', () => {
//   const userId = '09876'
//   const treeState = {
//     '1': { id: '1', childIds: ['123', '321'] },
//     '123': {
//       id: '123',
//       parentId: '1',
//       childIds: [],
//       collapsedBy: { '09876': true },
//       completed: true,
//       taggedByIds: []
//     },
//     '321': {
//       id: '321',
//       parentId: '1',
//       childIds: [],
//       collapsedBy: {},
//       completed: true,
//       taggedByIds: []
//     }
//   }

//   describe('INITIAL_NODE_STATE_LOADED', () => {
//     it('INITIAL_NODE_STATE_LOADED should assign the payload as the state', () => {
//       const initialTreeState = treeState
//       const initialNodeStateLoaded = {
//         type: INITIAL_NODE_STATE_LOADED,
//         payload: {
//           rootNodeId: '1',
//           initialTreeState
//         }
//       }

//       const newTreeState = treeReducer.tree({}, initialNodeStateLoaded)

//       expect(newTreeState).to.deep.equal({
//         '1': { id: '1', childIds: ['123', '321'] },
//         '123': {
//           id: '123',
//           parentId: '1',
//           childIds: [],
//           focused: true,
//           notesFocused: false,
//           collapsedBy: { '09876': true },
//           completed: true,
//           taggedByIds: []
//         },
//         '321': {
//           id: '321',
//           parentId: '1',
//           childIds: [],
//           collapsedBy: {},
//           completed: true,
//           taggedByIds: []
//         }
//       })
//     })
//   })

//   describe('NODE_CREATED', () => {
//     it('NODE_CREATED should add the new node to state', () => {
//       const newNodeId = '111'
//       const parentId = '123'
//       const childIds = []
//       const content = 'some content'
//       const action = nodeActions.nodeCreated(nodeFactory(newNodeId, parentId, childIds, content, userId))

//       const newTreeState = treeReducer.tree(treeState, action)

//       expect(newTreeState['111'].id).to.equal(newNodeId)
//       expect(newTreeState['111'].parentId).to.equal(parentId)
//       expect(newTreeState['111'].childIds).to.equal(childIds)
//       expect(newTreeState['111'].content).to.equal(content)
//     })
//   })

//   describe('NODES_DELETED', () => {
//     it('NODES_DELETED should set each node as deleted, not visisble and not selected', () => {
//       const nodeIds = ['123', '321']
//       const action = nodeActions.nodesDeleted(nodeIds)

//       const newTreeState = treeReducer.tree(treeState, action)

//       expect(newTreeState['123'].deleted).to.equal(true)
//       expect(newTreeState['123'].visible).to.equal(false)
//       expect(newTreeState['123'].selected).to.equal(false)
//       expect(newTreeState['321'].deleted).to.equal(true)
//       expect(newTreeState['321'].visible).to.equal(false)
//       expect(newTreeState['321'].selected).to.equal(false)
//     })
//   })

//   describe('NODE_TAGS_UPDATED', () => {
//     it('NODE_TAGS_UPDATED should set the nodes tags', () => {
//       const nodeId = '123'
//       const tagIds = [ 'inprogress', 'learning' ]
//       const action = nodeActions.nodeTagsUpdated(nodeId, tagIds)

//       const newTreeState = treeReducer.tree(treeState, action)

//       expect(newTreeState['123'].taggedByIds).to.deep.equal(tagIds)
//     })
//   })

//   describe('TAG_ADDED', () => {
//     it('should add the tag to the node state', () => {
//       const nodeId = '123'
//       const action = nodeActions.tagAdded(nodeId, 'inprogress')

//       const newTreeState = treeReducer.tree(treeState, action)

//       expect(newTreeState['123'].taggedByIds).to.deep.equal(['inprogress'])
//     })
//   })

//   describe('TAG_REMOVED', () => {
//     it('should remove the tag from node state', () => {
//       const nodeId = '123'
//       let newTreeState = treeState
//       const addInProgressTagAction = nodeActions.tagAdded(nodeId, 'inprogress')
//       newTreeState = treeReducer.tree(newTreeState, addInProgressTagAction)
//       const addLearningTagAction = nodeActions.tagAdded(nodeId, 'learning')
//       newTreeState = treeReducer.tree(newTreeState, addLearningTagAction)

//       const action = nodeActions.tagRemoved(nodeId, 'learning')

//       newTreeState = treeReducer.tree(newTreeState, action)

//       expect(newTreeState[nodeId].taggedByIds).to.deep.equal(['inprogress'])
//     })
//   })
// })
