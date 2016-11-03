import * as firebaseActions from '../../../src/js/actions/firebase/firebase-node-actions'
import * as nodeActions from '../../../src/js/actions/node/node-actions'
import * as treeQueries from '../../../src/js/utilities/tree-queries'
import * as nodeThunks from '../../../src/js/actions/node/node-thunks'
import sinon from 'sinon'
import { expect } from 'chai'

describe('node-thunks', () => {
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
    it('should create and dispatch optimistic actions', () => {
      // console.log(firebaseDb);
      // sinon.spy(firebaseDb, 'ref').and.callFake(() => {
      //   return {
      //     push: () => { return '123456'; } // new node ID
      //   };
      // });
      // // const nodeRef = firebase.database().ref().child('nodes');
      // // sinon.spy(nodeRef, 'ref');

      // nodeThunks.createNode('123', 1, 'some content')(dispatch, getState);

      // expect(firebaseDb.ref).toHaveBeenCalledWith('nodes');
    })
    it('should create the node as a child if the currently selected node is a parent', () => {

    })
    it('should create the node as a sibling if the currently selected node is not a parent', () => {

    })
    it('should create the node as a sibling if the currently selected node is collapsed', () => {

    })
    it('should focus the new node if the createdFromSiblingOffset is greater than 0', () => {

    })
    it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    })
    it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    })
  })

  describe('updateContent', () => {
    it('should dispatch actions to firebase and reducer', () => {
      const nodeId = '123'
      const newContent = 'new content'
      const updateNodeContentSpy = sinon.spy(firebaseActions, 'updateNodeContent')
      const contentUpdatedSpy = sinon.spy(nodeActions, 'contentUpdated')

      nodeThunks.updateContent(nodeId, newContent)(dispatch, getState)

      expect(updateNodeContentSpy).to.have.been.calledWith(nodeId, newContent, userId)
      expect(contentUpdatedSpy).to.have.been.calledWith(nodeId, newContent)
    })
  })

  describe('toggleNodeExpansion', function () {
    const nodeId = '123'
    const getAllDescendantIdsSpy = sinon.spy(treeQueries, 'getAllDescendantIds')
    const getAllUncollapsedDescedantIdsSpy = sinon.spy(treeQueries, 'getAllUncollapsedDescedantIds')
    const nodeExpandedSpy = sinon.spy(nodeActions, 'nodeExpanded')
    const nodeCollapsedSpy = sinon.spy(nodeActions, 'nodeCollapsed')
    const collapseNodeSpy = sinon.spy(firebaseActions, 'collapseNode')
    const expandNodeSpy = sinon.spy(firebaseActions, 'expandNode')

    beforeEach(function () {
      getAllDescendantIdsSpy.reset()
      getAllUncollapsedDescedantIdsSpy.reset()
      nodeExpandedSpy.reset()
      nodeCollapsedSpy.reset()
    })

    it('should dispatch get all descendents if forceToggleChildrenExpansion = true', () => {
      nodeThunks.toggleNodeExpansion(nodeId, true)(dispatch, getState)

      expect(getAllDescendantIdsSpy).to.have.been.calledWith(nodes, nodeId)
      expect(getAllDescendantIdsSpy.callCount).to.equal(1)
    })

    it('should dispatch get all uncollapsed descendents if forceToggleChildrenExpansion = false', () => {
      nodeThunks.toggleNodeExpansion(nodeId, false)(dispatch, getState)

      expect(getAllUncollapsedDescedantIdsSpy).to.have.been.calledWith(nodeId, nodes, nodeId)
      expect(getAllDescendantIdsSpy.callCount).to.equal(0)
    })

    it('should dispatch nodeExpanded any sync to firebase if node is collapsed', () => {
      nodeThunks.toggleNodeExpansion(nodeId, false)(dispatch, getState)

      expect(expandNodeSpy).to.have.been.calledWith(nodeId, userId)
      expect(nodeExpandedSpy).to.have.been.calledWith(nodeId, [], userId)
      expect(nodeCollapsedSpy.callCount).to.equal(0)
    })

    it('should dispatch nodeCollapsed and sync to firebase if node is expanded', () => {
      nodeThunks.toggleNodeExpansion('321', true)(dispatch, getState)

      expect(collapseNodeSpy).to.have.been.calledWith('321', userId)
      expect(nodeCollapsedSpy).to.have.been.calledWith('321', [], userId)
      expect(nodeExpandedSpy.callCount).equal(0)
    })
  })

  describe('selectNode', () => {
    it('should dispatch nodeSelected', () => {
      const nodeId = '123'
      const nodeSelectedSpy = sinon.spy(nodeActions, 'nodeSelected')

      nodeThunks.selectNode(nodeId)(dispatch, getState)

      expect(nodeSelectedSpy).to.have.been.calledWith(nodeId)
    })
  })

  describe('deselectNode', () => {
    it('should dispatch nodeDeselected', () => {
      const nodeId = '123'
      const nodeDeselectedSpy = sinon.spy(nodeActions, 'nodeDeselected')

      nodeThunks.deselectNode(nodeId)(dispatch, getState)

      expect(nodeDeselectedSpy).to.have.been.calledWith(nodeId)
    })
  })

  describe('toggleNodeMenu', () => {
    it('should dispatch closeAllMenusAndDeselectAllNodes and toggleNodeMenu', () => {
      const nodeId = '123'
      const closeAllMenusAndDeselectAllNodesSpy = sinon.spy(nodeActions, 'closeAllMenusAndDeselectAllNodes')
      const nodeMenuToggledSpy = sinon.spy(nodeActions, 'nodeMenuToggled')

      nodeThunks.toggleNodeMenu(nodeId)(dispatch, getState)

      expect(closeAllMenusAndDeselectAllNodesSpy).to.have.been.calledWith(nodeId)
      expect(nodeMenuToggledSpy).to.have.been.calledWith(nodeId)
    })
  })

  describe('toggleNodeComplete', () => {
    it('should dispatch nodeCompleteToggled and updateNodeComplete', () => {
      const nodeId = '123'
      const nodeCompleteToggledSpy = sinon.spy(nodeActions, 'nodeCompleteToggled')
      const updateNodeCompleteSpy = sinon.spy(firebaseActions, 'updateNodeComplete')

      nodeThunks.toggleNodeComplete(nodeId)(dispatch, getState)

      expect(nodeCompleteToggledSpy).to.have.been.calledWith(nodeId)
      expect(updateNodeCompleteSpy).to.have.been.calledWith(nodeId, false, userId)
    })
  })

  describe('updateNodeNotes', () => {
    it('should dispatch nodeNotesUpdated and updateNodeNotes', () => {
      const nodeId = '123'
      const notes = 'some notes'
      const nodeNotesUpdatedSpy = sinon.spy(nodeActions, 'nodeNotesUpdated')
      const updateNodeNotesSpy = sinon.spy(firebaseActions, 'updateNodeNotes')

      nodeThunks.updateNodeNotes(nodeId, notes)(dispatch, getState)

      expect(nodeNotesUpdatedSpy).to.have.been.calledWith(nodeId, notes)
      expect(updateNodeNotesSpy).to.have.been.calledWith(nodeId, notes, userId)
    })
  })

  describe('updateNodeDisplayMode', () => {
    it('should dispatch nodeDisplayModeUpdated and updateNodeDisplayMode', () => {
      const nodeId = '123'
      const mode = 'ordered'
      const nodeDisplayModeUpdatedSpy = sinon.spy(nodeActions, 'nodeDisplayModeUpdated')
      const updateNodeDisplayModeSpy = sinon.spy(firebaseActions, 'updateNodeDisplayMode')

      nodeThunks.updateNodeDisplayMode(nodeId, mode)(dispatch, getState)

      expect(nodeDisplayModeUpdatedSpy).to.have.been.calledWith(nodeId, mode)
      expect(updateNodeDisplayModeSpy).to.have.been.calledWith(nodeId, mode, userId)
    })
  })
})

