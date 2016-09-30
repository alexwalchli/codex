import * as treeQueries from '../../src/js/utilities/tree-queries';
import {expect} from 'chai';

describe('getPresentNodes', () =>{
  it('should return the present nodes', () => {
    const appState = {
      tree: {
        present: {
          abc: { id: 1}
        },
        past: {
          abc: { id: 1},
          def: { id: 2}
        }
      }
    };

    var presentNodes = treeQueries.getPresentNodes(appState);

    expect(presentNodes).to.equal(appState.tree.present);
  });
});

describe('getRootNodeId', () =>{
  it('should return the current page root node Id', () => {
    const appState = {
      app: { currentUserPageId: 'def' },
      userPages: {
        abc: { id: 'abc', rootNodeId: '123'},
        def: { id: 'def', rootNodeId: '456'},
        ghi: { id: 'ghi', rootNodeId: '789'}
      }
    };

    expect(treeQueries.getRootNodeId(appState)).to.equal('456');
  });
});

describe('getAllNodeIdsOrdered', () =>{
  it('should return an ordered array of all node Ids under a starting node', () => {
    const appState = {
      nodes: {
        abc: { id: 'abc', childIds: ['def', 'ghi']},
        def: { id: 'def', childIds: []},
        ghi: { id: 'ghi', childIds: []}
      }
    };

    expect(treeQueries.getAllNodeIdsOrdered(appState.nodes, 'abc')).to.deep.equal(['abc', 'def', 'ghi']);
  });
});

describe('getAllDescendantIds', () =>{
  it('should return a flattened, ordered, list of all children node Ids under the root node', () => {
    const appState = {
      nodes: {
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null},
        bbb: { id: 'bbb', childIds: ['ddd'], collapsed: true, parentId: 'aaa'},
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa'},
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb'},
        eee: { id: 'eee', childIds: [], parentId: 'ddd'}
      }
    };

    expect(treeQueries.getAllNodeIdsOrdered(appState.nodes, 'aaa')).to.deep.equal(['aaa', 'bbb', 'ddd', 'eee', 'ccc']);
  });

  it('should return only the start node id if it is a lowest level descedent', () => {
    const appState = {
      nodes: {
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null},
        bbb: { id: 'bbb', childIds: ['ddd'], collapsed: true, parentId: 'aaa'},
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa'},
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb'},
        eee: { id: 'eee', childIds: [], parentId: 'ddd'}
      }
    };

    expect(treeQueries.getAllNodeIdsOrdered(appState.nodes, 'ccc')).to.deep.equal(['ccc']);
    expect(treeQueries.getAllNodeIdsOrdered(appState.nodes, 'eee')).to.deep.equal(['eee']);
  });

  it('should return only the start node descendents when the start node is not the root', () => {
    const appState = {
      nodes: {
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null},
        bbb: { id: 'bbb', childIds: ['ddd'], collapsed: true, parentId: 'aaa'},
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa'},
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb'},
        eee: { id: 'eee', childIds: [], parentId: 'ddd'}
      }
    };

    expect(treeQueries.getAllNodeIdsOrdered(appState.nodes, 'bbb')).to.deep.equal(['bbb', 'ddd', 'eee']);
  });
});

describe('getAllUncollapsedDescedantIds', () =>{
  it('should return a flattened, ordered, list of all children node Ids under a start node ' +
     'that are not collapsed under a parent and does not include the start node Id', () => {
    const appState = {
      nodes: {
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null},
        bbb: { id: 'bbb', childIds: ['ddd'], collapsed: true, parentId: 'aaa'},
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa'},
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb'},
        eee: { id: 'eee', childIds: [], parentId: 'ddd'}
      }
    };

    expect(treeQueries.getAllUncollapsedDescedantIds('aaa', appState.nodes, 'aaa')).to.deep.equal(['bbb', 'ccc']);
  });
});

describe('getCurrentlySelectedNodeIds', () =>{
  it('should return node Ids that are selected', () => {
    
  });
});

describe('getCurrentlyFocusedNodeId', () =>{
  it('should return the current node that is focused', () => {
    
  });

  it('should return the current node that has its notes focused', () => {
    
  });
});

describe('getSiblingNodeAbove', () =>{
  it('should return the sibling above a nodeId', () => {
    
  });

  it('should return null if there is no sibling above', () => {
    
  });
});

describe('getNextNodeThatIsVisible', () =>{
  it('should return the sibling nodeId above, if searching above and it is visible', () => {
    
  });

  it('should return the sibling nodeId below, if searching below and it is visible', () => {
    
  });

  it('should not return the sibling nodeId above, if searching above and it is not visible', () => {
    
  });

  it('should not eturn the sibling nodeId below, if searching below and it is not visible', () => {
    
  });
});