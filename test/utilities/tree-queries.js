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
    
  });
});

describe('getNodeIndex', () =>{
  it('should return a node index from the flattened node state tree', () => {
    
  });
});

describe('getAllNodeIdsOrdered', () =>{
  it('should return an ordered array of all node Ids under a starting node', () => {
    
  });
});

describe('getAllDescendantIds', () =>{
  it('should return a flattened, ordered, list of all children node Ids under the root node', () => {
    
  });

  it('should return only the start node id if it is a lowest level descedent', () => {
    
  });

  it('should return only the start node descendents when the start node is not the root', () => {
    
  });
});

describe('getAllUncollapsedDescedantIds', () =>{
  it('should return a flattened, ordered, list of all children node Ids under a start node ' +
     'that are not collapsed under a parent', () => {
    
  });
});

describe('getCurrentlySelectedNodeIds', () =>{
  it('should return node Ids that are selected', () => {
    
  });
});

describe('getCurrentlyFocusedNodeId', () =>{
  it('should return the current node that is focused', () => {
    
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