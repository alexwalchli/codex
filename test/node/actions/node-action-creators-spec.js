import * as nodeFirebaseActions from '../../../src/js/node/actions/node-firebase-actions'
import * as nodeActions from '../../../src/js/node/actions/node-actions'
import * as nodeActionCreators from '../../../src/js/node/actions/node-action-creators'
import * as nodeActionTypes from '../../../src/js/node/actions/node-action-types'
import * as nodeSelectors from '../../../src/js/node/selectors/node-selectors'
import sinon from 'sinon'
import { expect } from 'chai'

describe('node action creators', () => {
  let getState
  let dispatch
  let userId = 111
  const nodes = {
    '1': { id: '1', childIds: ['123', '321'] },
    '123': {
      id: '123',
      parentId: '1',
      childIds: [],
      collapsedBy: { '111': true },
      completed: true
    },
    '321': {
      id: '321',
      parentId: '1',
      childIds: [],
      collapsedBy: {},
      completed: true
    },
    '456': {
      id: '456',
      parentId: '1',
      childIds: ['789'],
      collapsedBy: {},
      completed: true
    },
    '789': {
      id: '789',
      parentId: '456',
      childIds: [],
      collapsedBy: {},
      completed: true
    }
  }

  beforeEach(() => {
    getState = () => {
      return {
        app: {
          currentUserPageId: 54321
        },
        tree: {
          present: nodes
        },
        auth: { id: userId }
      }
    }
    dispatch = sinon.spy()
  })

  describe('createNode', () => {
    // it('should create and dispatch optimistic actions', () => {
    //   // console.log(firebaseDb);
    //   // sinon.spy(firebaseDb, 'ref').and.callFake(() => {
    //   //   return {
    //   //     push: () => { return '123456'; } // new node ID
    //   //   };
    //   // });
    //   // // const nodeRef = firebase.database().ref().child('nodes');
    //   // // sinon.spy(nodeRef, 'ref');

    //   // nodeActions.createNode('123', 1, 'some content')(dispatch, getState);

    //   // expect(firebaseDb.ref).toHaveBeenCalledWith('nodes');
    // })
    // it('should create the node as a child if the currently selected node is a parent', () => {

    // })
    // it('should create the node as a sibling if the currently selected node is not a parent', () => {

    // })
    // it('should create the node as a sibling if the currently selected node is collapsed', () => {

    // })
    // it('should focus the new node if the createdFromSiblingOffset is greater than 0', () => {

    // })
    // it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    // })
    // it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    // })
  })

  describe('updateContent', () => {
    it('should dispatch actions to a updatedNodeContent to firebase and a contentUpdated', () => {
      const nodeId = '123'
      const newContent = 'new content'
      const firebaseUpdateNodeContentStub = sinon.stub(nodeFirebaseActions, 'updateNodeContent', () => ({updateNodeContentStub: true}))

      nodeActionCreators.updateContent(nodeId, newContent)(dispatch, getState)

      expect(firebaseUpdateNodeContentStub).to.have.been.calledWith(nodeId, newContent, userId)
      expect(dispatch).to.have.been.calledWith({updateNodeContentStub: true})
      expect(dispatch).to.have.been.calledWith({
        type: nodeActionTypes.CONTENT_UPDATED,
        nodeId,
        payload: {
          content: newContent,
          updatedById: userId
        }
      })
    })
  })

  describe('toggleNodeExpansion', function () {
    const nodeId = '123'
    const getAllDescendantIdsSpy = sinon.spy(nodeSelectors, 'getAllDescendantIds')
    const getAllUncollapsedDescedantIdsSpy = sinon.spy(nodeSelectors, 'getAllUncollapsedDescedantIds')
    const firebaseCollapseNodeStub = sinon.stub(nodeFirebaseActions, 'collapseNode', () => ({ firebaseCollapseNodeStub: true }))
    const firebaseExpandNodeStub = sinon.stub(nodeFirebaseActions, 'expandNode', () => ({ firebaseExpandNodeStub: true }))

    beforeEach(function () {
      getAllDescendantIdsSpy.reset()
      getAllUncollapsedDescedantIdsSpy.reset()
    })

    it('should dispatch get all descendents if forceToggleChildrenExpansion = true', () => {
      nodeActionCreators.toggleNodeExpansion(nodeId, true)(dispatch, getState)

      expect(getAllDescendantIdsSpy).to.have.been.calledWith(nodes, nodeId)
      expect(getAllDescendantIdsSpy.callCount).to.equal(1)
    })

    it('should dispatch get all uncollapsed descendents if forceToggleChildrenExpansion = false', () => {
      nodeActionCreators.toggleNodeExpansion(nodeId, false)(dispatch, getState)

      expect(getAllUncollapsedDescedantIdsSpy).to.have.been.calledWith(nodeId, nodes, nodeId)
      expect(getAllDescendantIdsSpy.callCount).to.equal(0)
    })

    it('should dispatch nodeExpanded any sync to firebase if node is collapsed', () => {
      nodeActionCreators.toggleNodeExpansion(nodeId, false)(dispatch, getState)

      expect(firebaseExpandNodeStub).to.have.been.calledWith(nodeId, userId)
      expect(firebaseCollapseNodeStub.callCount).to.equal(0)

      expect(dispatch).to.have.been.calledWith({ firebaseExpandNodeStub: true })
      expect(dispatch).to.have.been.calledWith({
        type: nodeActionTypes.NODE_EXPANDED,
        nodeId,
        payload: {
          allDescendentIds: [],
          userId
        }
      })
      expect(dispatch.callCount).to.equal(2)
    })

    it('should dispatch nodeCollapsed and sync to firebase if node is expanded', () => {
      nodeActionCreators.toggleNodeExpansion('321', true)(dispatch, getState)

      expect(firebaseCollapseNodeStub).to.have.been.calledWith('321', userId)
      expect(dispatch).to.have.been.calledWith({ firebaseCollapseNodeStub: true })
      expect(dispatch).to.have.been.calledWith({
        type: nodeActionTypes.NODE_COLLAPSED,
        nodeId: '321',
        payload: {
          allDescendentIds: [],
          userId
        }
      })
      expect(dispatch.callCount).equal(2)
    })
  })

  describe('selectNode', () => {
    it('should dispatch a nodeSelected for the node and its descendants', () => {
      const nodeId = '456'
      const descendantId = '789'

      nodeActionCreators.selectNode(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.calledWith({
        type: nodeActionTypes.NODE_TRANSACTION,
        payload: [
          {
            type: nodeActionTypes.NODE_SELECTED,
            undoable: false,
            nodeId
          },
          {
            type: nodeActionTypes.NODE_SELECTED,
            undoable: false,
            nodeId: descendantId
          }
        ]
      })
      expect(dispatch.callCount).to.equal(1)
    })
  })

  describe('deselectNode', () => {
    it('should dispatch a nodeDeselected for the node and its descendants', () => {
      const nodeId = '456'
      const descendantId = '789'

      nodeActionCreators.deselectNode(nodeId)(dispatch, getState)

      expect(dispatch).to.have.been.calledWith({
        type: nodeActionTypes.NODE_TRANSACTION,
        payload: [
          {
            type: nodeActionTypes.NODE_DESELECTED,
            undoable: false,
            nodeId
          },
          {
            type: nodeActionTypes.NODE_DESELECTED,
            undoable: false,
            nodeId: descendantId
          }
        ]
      })
      expect(dispatch.callCount).to.equal(1)
    })
  })

  describe('toggleNodeMenu', () => {
    it('should dispatch closeAllMenusAndDeselectAllNodes and toggleNodeMenu', () => {
      const nodeId = '123'
      const closeAllMenusAndDeselectAllNodesSpy = sinon.spy(nodeActions, 'closeAllMenusAndDeselectAllNodes')
      const nodeMenuToggledSpy = sinon.spy(nodeActions, 'nodeMenuToggled')

      nodeActionCreators.toggleNodeMenu(nodeId)(dispatch, getState)

      expect(closeAllMenusAndDeselectAllNodesSpy).to.have.been.calledWith(nodeId)
      expect(nodeMenuToggledSpy).to.have.been.calledWith(nodeId)
    })
  })

  describe('toggleNodeComplete', () => {
    it('should dispatch nodeCompleteToggled and updateNodeComplete', () => {
      const nodeId = '123'
      const nodeCompleteToggledSpy = sinon.spy(nodeActions, 'nodeCompleteToggled')
      const updateNodeCompleteSpy = sinon.spy(nodeFirebaseActions, 'updateNodeComplete')

      nodeActionCreators.toggleNodeComplete(nodeId)(dispatch, getState)

      expect(nodeCompleteToggledSpy).to.have.been.calledWith(nodeId)
      expect(updateNodeCompleteSpy).to.have.been.calledWith(nodeId, false, userId)
    })
  })

  describe('updateNodeNotes', () => {
    it('should dispatch nodeNotesUpdated and updateNodeNotes', () => {
      const nodeId = '123'
      const notes = 'some notes'
      const nodeNotesUpdatedSpy = sinon.spy(nodeActions, 'nodeNotesUpdated')
      const updateNodeNotesSpy = sinon.spy(nodeFirebaseActions, 'updateNodeNotes')

      nodeActionCreators.updateNodeNotes(nodeId, notes)(dispatch, getState)

      expect(nodeNotesUpdatedSpy).to.have.been.calledWith(nodeId, notes)
      expect(updateNodeNotesSpy).to.have.been.calledWith(nodeId, notes, userId)
    })
  })

  describe('updateNodeDisplayMode', () => {
    it('should dispatch nodeDisplayModeUpdated and updateNodeDisplayMode', () => {
      const nodeId = '123'
      const mode = 'ordered'
      const nodeDisplayModeUpdatedSpy = sinon.spy(nodeActions, 'nodeDisplayModeUpdated')
      const updateNodeDisplayModeSpy = sinon.spy(nodeFirebaseActions, 'updateNodeDisplayMode')

      nodeActionCreators.updateNodeDisplayMode(nodeId, mode)(dispatch, getState)

      expect(nodeDisplayModeUpdatedSpy).to.have.been.calledWith(nodeId, mode)
      expect(updateNodeDisplayModeSpy).to.have.been.calledWith(nodeId, mode, userId)
    })
  })
})

