import { tree } from '../../../src/js/node/reducers/tree-reducer'
import * as nodeOperations from '../../../src/js/node/operations/node-operations'
import * as nodeSelectors from '../../../src/js/node/selectors/node-selectors'
import * as nodeActions from '../../../src/js/node/actions/node-actions'
import { expect } from 'chai'
import sinon from 'sinon'

describe('treeReducer', () => {
  const dummyState = {
    '1': { id: '1', parentId: undefined, childIds: [ '2', '3', '5' ] },
    '2': { id: '2', parentId: '1', childIds: [], collapsedBy: {} },
    '3': { id: '3', parentId: '1', childIds: [ '4' ], collapsedBy: {} },
    '4': { id: '4', parentId: '3', childIds: [], collapsedBy: {} },
    '5': { id: '5', parentId: '1', childIds: [], collapsedBy: {} }
  }
  const dummyVisibleNodes = {
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true
  }

  beforeEach(() => {
    sinon.spy(nodeOperations, 'focus')
    sinon.spy(nodeOperations, 'unfocus')
    sinon.spy(nodeOperations, 'addChild')
    sinon.spy(nodeOperations, 'create')
    sinon.spy(nodeSelectors, 'getNextNodeThatIsVisible')
    sinon.spy(nodeSelectors, 'getCurrentlySelectedNodeIds')
    sinon.spy(nodeSelectors, 'getCurrentlyFocusedNodeId')
  })

  afterEach(() => {
    nodeOperations.focus.restore()
    nodeOperations.unfocus.restore()
    nodeOperations.addChild.restore()
    nodeOperations.create.restore()
    nodeSelectors.getNextNodeThatIsVisible.restore()
    nodeSelectors.getCurrentlySelectedNodeIds.restore()
    nodeSelectors.getCurrentlyFocusedNodeId.restore()
  })

  describe('INITIAL_TREE_STATE_LOAD', () => {
    const rootNodeId = '123'
    const initialTreeState = {
      '123': { id: '123', childIds: [ '456' ] },
      '456': { id: '456', parentId: '123' }
    }

    it('should set the state to the initial tree state', () => {
      const initialTreeStateLoadedAction = nodeActions.initialTreeStateLoad(rootNodeId, initialTreeState)

      const newState = tree(null, initialTreeStateLoadedAction)

      expect(newState).to.deep.equal({
        '123': { id: '123', childIds: [ '456' ] },
        '456': { id: '456', parentId: '123', focused: true, notesFocused: false }
      })
    })
    it('should focus the first child of the root node', () => {
      const initialTreeStateLoadedAction = nodeActions.initialTreeStateLoad(rootNodeId, initialTreeState)

      tree(null, initialTreeStateLoadedAction)

      expect(nodeOperations.focus).to.have.been.calledWith(initialTreeStateLoadedAction.payload.initialTreeState, '456', false)
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
      const nodeId = '1111'
      const originNodeId = '2'
      const originOffset = 1
      const content = 'some content'
      const userPageId = 'abc123'
      const userId = 'abc'
      const nodeCreationAction = nodeActions.nodeCreation(nodeId, originNodeId, originOffset, content, userPageId, userId)

      const newState = tree(state, nodeCreationAction)

      expect(newState[nodeId]).to.be.defined
      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '2', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should create the node as a sibling if the currently selected node is not a parent', () => {
      const nodeId = '1111'
      const originNodeId = '3'
      const originOffset = 1
      const content = 'some content'
      const userPageId = 'abc123'
      const userId = 'abc'
      const nodeCreationAction = nodeActions.nodeCreation(nodeId, originNodeId, originOffset, content, userPageId, userId)

      tree(state, nodeCreationAction)

      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '1', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should create the node as a sibling if the currently selected node is collapsed', () => {
      const nodeId = '1111'
      const originNodeId = '4'
      const originOffset = 1
      const content = 'some content'
      const userPageId = 'abc123'
      const userId = 'abc'
      const nodeCreationAction = nodeActions.nodeCreation(nodeId, originNodeId, originOffset, content, userPageId, userId)

      tree(state, nodeCreationAction)

      expect(nodeOperations.create).to.have.been.calledWith(
        nodeCreationAction.payload.nodeId, '1', [], nodeCreationAction.payload.content, nodeCreationAction.payload.userId
      )
    })
    it('should focus the new node if the originOffset is greater than 0', () => {
      const nodeId = '1111'
      const originNodeId = '4'
      const originOffset = 1
      const content = 'some content'
      const userPageId = 'abc123'
      const userId = 'abc'
      const nodeCreationAction = nodeActions.nodeCreation(nodeId, originNodeId, originOffset, content, userPageId, userId)

      tree(state, nodeCreationAction)

      expect(nodeOperations.focus.firstCall.args[0].id).to.equal(nodeCreationAction.payload.nodeId)
    })
    it('should not focus the new node if the originOffset is equal to or less than 0', () => {
      const nodeId = '1111'
      const originNodeId = '4'
      const originOffset = 0
      const content = 'some content'
      const userPageId = 'abc123'
      const userId = 'abc'
      const nodeCreationAction = nodeActions.nodeCreation(nodeId, originNodeId, originOffset, content, userPageId, userId)

      tree(state, nodeCreationAction)

      expect(nodeOperations.focus).to.not.have.been.called
    })
  })
  describe('NODE_CONTENT_UPDATE', () => {
    it('should set the node to content and set updatedById', () => {
      const newState = tree(dummyState, nodeActions.nodeContentUpdate('2', 'new content', 'user123'))

      expect(newState['2'].content).to.equal('new content')
      expect(newState['2'].updatedById).to.equal('user123')
    })
  })
  describe('NODE_FOCUS', () => {
    it('should set the node to focused', () => {
      const newState = tree(dummyState, nodeActions.nodeFocus('2', false))

      expect(nodeOperations.focus.firstCall.args[0]).to.deep.equal(dummyState, '2', false)
      expect(newState['2'].focused).to.equal(true)
    })
  })
  describe('NODE_UNFOCUS', () => {
    it('should set the node to unfocused', () => {
      const newState = tree(dummyState, nodeActions.nodeUnfocus('2'))

      expect(nodeOperations.unfocus.firstCall.args[0]).to.deep.equal(dummyState['2'])
      expect(newState['2'].focused).to.equal(false)
    })
  })
  describe('NODE_DEMOTION', () => {
    // TODO: instead of demoting to the node above, which could cause the node to be demoted several levels
    // should it only get demoted 1 level, to its next sibling above, if possible?
    it('should reassign the demoted node parentId to the node above and focus it', () => {
      const nodeDemotionAction = nodeActions.nodeDemotion('5', '1', dummyVisibleNodes, 'user123')

      const newState = tree(dummyState, nodeDemotionAction)

      expect(newState['5'].parentId).to.equal('4')
      expect(newState['5'].focused).to.equal(true)
      expect(nodeOperations.focus.firstCall.args[1]).to.equal('5')
    })
  })
  describe('NODE_PROMOTION', () => {
    it('it should reassign all siblings below to be the promoted nodes children and focus the promoted node', () => {
      const state = {
        '1': { id: '1', parentId: undefined, childIds: [ '2' ] },
        '2': { id: '2', parentId: '1', childIds: ['3', '4', '5'] },
        '3': { id: '3', parentId: '2', childIds: [] },
        '4': { id: '4', parentId: '2', childIds: [] },
        '5': { id: '5', parentId: '2', childIds: [] }
      }
      const nodePromotionAction = nodeActions.nodePromotion('4', '2', '1', dummyVisibleNodes, 'user123')

      const newState = tree(state, nodePromotionAction)

      expect(newState['5'].parentId).to.equal('4')
      expect(newState['4'].focused).to.equal(true)
      expect(newState['4'].parentId).to.equal('1')
      expect(newState['2'].childIds).to.deep.equal(['3'])
      expect(newState['1'].childIds).to.deep.equal(['2', '4'])
    })
  })
  describe('NODE_EXPANSION_TOGGLE', () => {
    it('should expand the node and its collapsed descendents if it is currently collapsed by the current user', () => {
      const state = {
        '1': { id: '1', parentId: undefined, childIds: [ '2' ] },
        '2': { id: '2', parentId: '1', childIds: ['3', '4', '5'], collapsedBy: { 'user123': true } },
        '3': { id: '3', parentId: '2', childIds: [] },
        '4': { id: '4', parentId: '2', childIds: ['5'], collapsedBy: { 'user123': true } },
        '5': { id: '5', parentId: '4', childIds: [] }
      }
      const nodeExpansionToggleAction = nodeActions.nodeExpansionToggle('2', true, 'user123')

      const newState = tree(state, nodeExpansionToggleAction)

      expect(newState['2'].collapsedBy).to.deep.equal({ 'user123': false })
      expect(newState['4'].collapsedBy).to.deep.equal({ 'user123': false })
    })
    it('should collapse the node and its expanded descendents if it is currently collapsed by the current user', () => {
      const state = {
        '1': { id: '1', parentId: undefined, childIds: [ '2' ] },
        '2': { id: '2', parentId: '1', childIds: ['3', '4', '5'], collapsedBy: { 'user123': false } },
        '3': { id: '3', parentId: '2', childIds: [] },
        '4': { id: '4', parentId: '2', childIds: ['5'], collapsedBy: { 'user123': false } },
        '5': { id: '5', parentId: '4', childIds: [] }
      }
      const nodeExpansionToggleAction = nodeActions.nodeExpansionToggle('2', true, 'user123')

      const newState = tree(state, nodeExpansionToggleAction)

      expect(newState['2'].collapsedBy).to.deep.equal({ 'user123': true })
      expect(newState['4'].collapsedBy).to.deep.equal({ 'user123': true })
    })
  })
  describe('NODE_SELECTION', () => {
    it('should select the node and all its descendants', () => {
      const nodeSelectionAction = nodeActions.nodeSelection('3')

      const newState = tree(dummyState, nodeSelectionAction)

      expect(newState['3'].selected).to.equal(true)
      expect(newState['4'].selected).to.equal(true)
    })
  })
  describe('NODE_DESELECTION', () => {
    it('should deselect the node and all its descendants', () => {
      const nodeDeselectionAction = nodeActions.nodeDeselection('3')

      const newState = tree(dummyState, nodeDeselectionAction)

      expect(newState['3'].selected).to.equal(false)
      expect(newState['4'].selected).to.equal(false)
    })
  })
  describe('NODE_COMPLETION_TOGGLE', () => {
    it('should toggle the node completed', () => {
      const nodeCompletionToggle = nodeActions.nodeCompletionToggle('2', 'user123')

      let newState = tree(dummyState, nodeCompletionToggle)

      expect(newState['2'].completed).to.equal(true)
      expect(newState['2'].updatedById).to.equal('user123')

      newState = tree(newState, nodeCompletionToggle)

      expect(newState['2'].completed).to.equal(false)
      expect(newState['2'].updatedById).to.equal('user123')
    })
  })
  describe('NODE_NOTES_UPDATE', () => {
    it('should update the node notes', () => {
      const newState = tree(dummyState, nodeActions.nodeNotesUpdate('2', 'new notes', 'user123'))

      expect(newState['2'].notes).to.equal('new notes')
      expect(newState['2'].updatedById).to.equal('user123')
    })
  })
  // describe('NODES_COMPLETION', () => {
  //   it('should set all nodes to complete', () => {
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
