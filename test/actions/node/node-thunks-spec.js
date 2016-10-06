import * as firebaseActions from '../../../src/js/actions/firebase/firebase-node-actions';
import * as nodeActions from '../../../src/js/actions/node/node-actions';
import * as treeQueries from '../../../src/js/utilities/tree-queries';
import * as nodeThunks from '../../../src/js/actions/node/node-thunks';


describe('node-thunks', () => {
  const nodes = {
    '1': { id: '1', childIds: ['123', '321']},
    '123': {
      id: '123',
      parentId: '1',
      childIds: [],
      collapsed: true,
      completed: true
    },
    '321': {
      id: '321',
      parentId: '1',
      childIds: [],
      collapsed: false,
      completed: true
    }
  };
  let getState,
      dispatch,
      userId = 111;

  beforeEach(() => {
    getState = () => {
      return {
        app: {
          currentUserPageId: 54321
        },
        tree: {
          present: nodes,
        },
        auth: { id: userId }
      };
    };
    dispatch = jasmine.createSpy();
  });

  describe('createNode', () => {
    it('should create and dispatch optimistic actions', () => {
      // console.log(firebaseDb);
      // spyOn(firebaseDb, 'ref').and.callFake(() => {
      //   return {
      //     push: () => { return '123456'; } // new node ID
      //   };
      // });
      // // const nodeRef = firebase.database().ref().child('nodes');
      // // spyOn(nodeRef, 'ref');

      // nodeThunks.createNode('123', 1, 'some content')(dispatch, getState);

      // expect(firebaseDb.ref).toHaveBeenCalledWith('nodes');
    });
    it('should create the node as a child if the currently selected node is a parent', () => {

    });
    it('should create the node as a sibling if the currently selected node is not a parent', () => {

    });
    it('should focus the new node if the createdFromSiblingOffset is greater than 0', () => {

    });
    it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    });
    it('should not focus the new node if the createdFromSiblingOffset is equal to or less than 0', () => {

    });
  });

  describe('updateContent', () => {
    it('should dispatch actions to firebase and reducer', () => {
      const nodeId = '123',
            newContent = 'new content';
      spyOn(firebaseActions, 'updateNodeContent');
      spyOn(nodeActions, 'contentUpdated');

      nodeThunks.updateContent(nodeId, newContent)(dispatch, getState);

      expect(firebaseActions.updateNodeContent).toHaveBeenCalledWith(nodeId, newContent, userId);
      expect(nodeActions.contentUpdated).toHaveBeenCalledWith(nodeId, newContent);
    });
  });

  describe('toggleNodeExpansion', () => {
    const nodeId = '123';

    beforeEach(() => {
      spyOn(treeQueries, 'getAllDescendantIds');
      spyOn(treeQueries, 'getAllUncollapsedDescedantIds');
      spyOn(nodeActions, 'nodeExpanded');
      spyOn(nodeActions, 'nodeCollapsed');
    });

    it('should dispatch get all descendents if forceToggleChildrenExpansion = true', () => {
      nodeThunks.toggleNodeExpansion(nodeId, true)(dispatch, getState);

      expect(treeQueries.getAllDescendantIds).toHaveBeenCalledWith(nodes, nodeId);
      expect(treeQueries.getAllUncollapsedDescedantIds.calls.count()).toEqual(0);
    });
    it('should dispatch get all uncollapsed descendents if forceToggleChildrenExpansion = false', () => {
      nodeThunks.toggleNodeExpansion(nodeId, false)(dispatch, getState);

      expect(treeQueries.getAllUncollapsedDescedantIds).toHaveBeenCalledWith(nodeId, nodes, nodeId);
      expect(treeQueries.getAllDescendantIds.calls.count()).toEqual(0);
    });
    it('should dispatch nodeExpanded if node is collapsed', () => {
      nodeThunks.toggleNodeExpansion(nodeId, false)(dispatch, getState);

      expect(nodeActions.nodeExpanded).toHaveBeenCalledWith(nodeId, undefined);
      expect(nodeActions.nodeCollapsed.calls.count()).toEqual(0);
    });
    it('should dispatch nodeCollapsed if node is expanded', () => {
      nodeThunks.toggleNodeExpansion('321', true)(dispatch, getState);

      expect(nodeActions.nodeCollapsed).toHaveBeenCalledWith('321', undefined);
      expect(nodeActions.nodeExpanded.calls.count()).toEqual(0);
    });
  });

  describe('selectNode', () => {
    it('should dispatch nodeSelected', () => {
      const nodeId = '123';
      spyOn(nodeActions, 'nodeSelected');

      nodeThunks.selectNode(nodeId)(dispatch, getState);

      expect(nodeActions.nodeSelected).toHaveBeenCalledWith(nodeId);
    });
  });

  describe('deselectNode', () => {
    it('should dispatch nodeDeselected', () => {
      const nodeId = '123';
      spyOn(nodeActions, 'nodeDeselected');

      nodeThunks.deselectNode(nodeId)(dispatch, getState);

      expect(nodeActions.nodeDeselected).toHaveBeenCalledWith(nodeId);
    });
  });

  describe('toggleNodeMenu', () => {
    it('should dispatch closeAllMenusAndDeselectAllNodes and toggleNodeMenu', () => {
      const nodeId = '123';
      spyOn(nodeActions, 'closeAllMenusAndDeselectAllNodes');
      spyOn(nodeActions, 'nodeMenuToggled');

      nodeThunks.toggleNodeMenu(nodeId)(dispatch, getState);

      expect(nodeActions.closeAllMenusAndDeselectAllNodes).toHaveBeenCalledWith(nodeId);
      expect(nodeActions.nodeMenuToggled).toHaveBeenCalledWith(nodeId);
    });
  });

  describe('toggleNodeComplete', () => {
    it('should dispatch nodeCompleteToggled and updateNodeComplete', () => {
      const nodeId = '123';
      spyOn(nodeActions, 'nodeCompleteToggled');
      spyOn(firebaseActions, 'updateNodeComplete');
      nodeThunks.toggleNodeComplete(nodeId)(dispatch, getState);

      expect(nodeActions.nodeCompleteToggled).toHaveBeenCalledWith(nodeId);
      expect(firebaseActions.updateNodeComplete).toHaveBeenCalledWith(nodeId, false, userId);
    });
  });

  describe('updateNodeNotes', () => {
    it('should dispatch nodeNotesUpdated and updateNodeNotes', () => {
      const nodeId = '123',
            notes = 'some notes';
      spyOn(nodeActions, 'nodeNotesUpdated');
      spyOn(firebaseActions, 'updateNodeNotes');

      nodeThunks.updateNodeNotes(nodeId, notes)(dispatch, getState);

      expect(nodeActions.nodeNotesUpdated).toHaveBeenCalledWith(nodeId, notes);
      expect(firebaseActions.updateNodeNotes).toHaveBeenCalledWith(nodeId, notes, userId);
    });
  });

  describe('updateNodeDisplayMode', () => {
    it('should dispatch nodeDisplayModeUpdated and updateNodeDisplayMode', () => {
      const nodeId = '123',
            mode = 'ordered';
      spyOn(nodeActions, 'nodeDisplayModeUpdated');
      spyOn(firebaseActions, 'updateNodeDisplayMode');

      nodeThunks.updateNodeDisplayMode(nodeId, mode)(dispatch, getState);

      expect(nodeActions.nodeDisplayModeUpdated).toHaveBeenCalledWith(nodeId, mode);
      expect(firebaseActions.updateNodeDisplayMode).toHaveBeenCalledWith(nodeId, mode, userId);
    });
  });
});