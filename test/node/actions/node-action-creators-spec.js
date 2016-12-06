import * as nodeActions from '../../../src/js/node/actions/node-actions'
import * as nodeActionCreators from '../../../src/js/node/actions/node-action-creators'
import * as nodeRepository from '../../../src/js/node/repositories/node-repository'
import sinon from 'sinon'
import { expect } from 'chai'
import * as I from 'immutable'

describe('nodeActionCreators', () => {
  const newNodeId = '1111'
  const userId = 111
  const currentUserPageId = 54321
  const dispatch = sinon.spy()
  const nodes = I.fromJS({
    '1': { id: '1', childIds: ['123', '321', '456'] },
    '123': {
      id: '123',
      parentId: '1',
      childIds: [],
      collapsedBy: {},
      focused: true,
      notesFocused: false,
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
    },
    '456': {
      id: '456',
      parentId: '1',
      childIds: ['789'],
      collapsedBy: {},
      completed: true,
      taggedByIds: []
    },
    '789': {
      id: '789',
      parentId: '456',
      childIds: [],
      collapsedBy: {},
      completed: true,
      taggedByIds: []
    }
  })
  const visibleNodes = I.fromJS({
    '1': true,
    '123': true,
    '321': true,
    '456': true,
    '789': true
  })
  const getState = () => {
    return {
      auth: I.fromJS({
        id: userId
      }),
      app: I.fromJS({
        currentUserPageId: currentUserPageId
      }),
      tree: nodes,
      userPages: I.fromJS([{ id: currentUserPageId, rootNodeId: '1' }]),
      visibleNodes: visibleNodes
    }
  }

  beforeEach(() => {
    dispatch.reset()
    sinon.stub(nodeRepository, 'getNewNodeId', () => (newNodeId))
    sinon.stub(nodeRepository, 'updateNodes', () => {})
    sinon.stub(nodeRepository, 'updateNode', () => {})
    sinon.stub(nodeRepository, 'createNode', () => {})
    sinon.stub(nodeRepository, 'reassignParentNode', () => {})
    sinon.spy(nodeActions, 'nodeCreation')
    sinon.spy(nodeActions, 'nodeFocus')
    sinon.spy(nodeActions, 'nodeContentUpdate')
    sinon.spy(nodeActions, 'nodeDemotion')
    sinon.spy(nodeActions, 'nodePromotion')
    sinon.spy(nodeActions, 'nodeSelection')
    sinon.spy(nodeActions, 'nodeDeselection')
  })

  afterEach(() => {
    nodeRepository.getNewNodeId.restore()
    nodeRepository.createNode.restore()
    nodeRepository.updateNodes.restore()
    nodeRepository.updateNode.restore()
    nodeRepository.reassignParentNode.restore()
    nodeActions.nodeCreation.restore()
    nodeActions.nodeFocus.restore()
    nodeActions.nodeContentUpdate.restore()
    nodeActions.nodeDemotion.restore()
    nodeActions.nodePromotion.restore()
    nodeActions.nodeSelection.restore()
    nodeActions.nodeDeselection.restore()
  })

  describe('createNode', () => {
    it('should retrieve a new node ID and dispatch a nodeCreation action', () => {
      const originNodeId = '123'
      const originOffset = 1
      const content = 'some content'

      nodeActionCreators.createNode('123', 1, 'some content')(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeCreation).to.have.been.calledWith(
        newNodeId,
        originNodeId,
        '1',
        I.List([]),
        '123',
        originOffset,
        content,
        currentUserPageId,
        userId)
    })
    it('should create the node as a child if the origin node is has children', () => {
    })
    it('should create the node as a sibling if the currently selected node is not a parent', () => {
    })
    it('should create the node as a sibling if the currently selected node is collapsed', () => {
    })
    it('should focus the new node if the originOffset is greater than 0', () => {
    })
    it('should not focus the new node if the originOffset is equal to or less than 0', () => {
    })
  })
  describe('focusNode', () => {
    it('should dispatch a nodeFocus action', () => {
      const nodeId = '123'
      const focusNotes = true

      nodeActionCreators.focusNode(nodeId, focusNotes)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeFocus).to.have.been.calledWith(nodeId, focusNotes)
    })
  })
  describe('focusNodeAbove', () => {
    it('should get the next visible node above and dispatch a nodeFocus action', () => {
      const nodeId = '321'

      nodeActionCreators.focusNodeAbove(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeFocus).to.have.been.calledWith('123')
    })
  })
  describe('nodeFocusBelow', () => {
    it('should get the next visible node below and dispatch a nodeFocus action', () => {
      const nodeId = '321'

      nodeActionCreators.focusNodeBelow(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeFocus).to.have.been.calledWith('456')
    })
  })
  describe('updateNodeContent', () => {
    it('should dispatch a nodeContentUpdate action', () => {
      const nodeId = '321'
      const content = 'some content'

      nodeActionCreators.updateNodeContent(nodeId, content)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeContentUpdate).to.have.been.calledWith(nodeId, content, userId)
    })
  })
  // describe('deleteNode', () => {
  //   it('should dispatch a nodeDeletion action', () => {
  //     throw new Error('not impl')
  //   })
  // })
  describe('demoteNode', () => {
    it('should dispatch a nodeDemotion action', () => {
      const nodeId = '321'

      nodeActionCreators.demoteNode(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeDemotion).to.have.been.calledWith(
        nodeId,
        '1',
        '1',
        '123',
        undefined,
        visibleNodes,
        userId)
    })
  })
  describe('promoteNode', () => {
    it('should not dispatch or update persistence if the node has the root node as a parent', () => {
      const nodeId = '123'
      const node = nodes.get(nodeId)
      const parentNode = nodes.get(node.get('parentId'))
      const currentParentId = parentNode.get('id')
      const newParentId = parentNode.get('parentId')
      const siblingIds = parentNode.get('childIds')

      nodeActionCreators.promoteNode(nodeId, siblingIds, currentParentId, newParentId, visibleNodes, userId)(dispatch, getState)

      expect(dispatch).to.not.have.been.called
      expect(nodeRepository.reassignParentNode).to.not.have.been.called
    })
    // it('should dispatch a nodePromotion action and update persistence', () => {
    //   const nodeId = '456'
    //   const node = nodes[nodeId]
    //   const parentNode = nodes[node.parentId]
    //   const currentParentId = parentNode.id
    //   const newParentId = parentNode.parentId
    //   const siblingIds = parentNode.childIds

    //   nodeActionCreators.promoteNode(nodeId, siblingIds, currentParentId, newParentId, visibleNodes, userId)(dispatch, getState)

    //   expect(dispatch).to.not.have.been.called
    //   expect(nodeRepository.reassignParentNode).to.not.have.been.called
    //   // expect(dispatch).to.have.been.called
    //   // expect(nodeActions.nodePromotion).to.have.been.calledWith(nodeId, siblingIds, currentParentId, newParentId, visibleNodes, state.auth.id)
    //   // expect(nodeRepository.updateNodes).to.have.been.calledWith([
    //   //   nodes[currentParentId],
    //   //   nodes[newParentId],
    //   //   nodes[nodeId],
    //   //   ...siblingIds.map(siblingId => nodes[siblingId])
    //   // ])
    // })
  })
  describe('selectNode', () => {
    it('should dispatch a nodeSelection action', () => {
      const nodeId = '321'

      nodeActionCreators.selectNode(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeSelection).to.have.been.calledWith(nodeId)
    })
  })
  describe('deselectNode', () => {
    it('should dispatch a nodeDeselection action', () => {
      const nodeId = '321'

      nodeActionCreators.deselectNode(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.called
      expect(nodeActions.nodeDeselection).to.have.been.calledWith(nodeId)
    })
  })
  // describe('toggleNodeComplete', () => {
  //   it('should dispatch a nodeCompletionToggle action', () => {
  //     throw new Error('not impl')
  //   })
  // })
  // describe('toggleNodeMenu', () => {
  //   it('should dispatch allNodeMenuClose and nodeMenuToggle actions', () => {
  //     throw new Error('not impl')
  //   })
  // })
})
