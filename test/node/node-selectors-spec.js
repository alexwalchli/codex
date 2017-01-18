import * as nodeSelectors from '../../src/js/node/node-selectors'
import { expect } from 'chai'
import * as I from 'immutable'

describe('nodeSelectors', () => {
  describe('currentTreeState', () => {
    it('should return the present nodes', () => {
      const state = {
        tree: I.fromJS({
          abc: { id: 1 },
          def: { id: 2, deleted: true }
        })
      }

      var presentNodes = nodeSelectors.currentTreeState(state)

      expect(presentNodes).to.deep.equal(I.fromJS({ abc: { id: 1 } }))
    })
  })

  describe('getRootNodeId', () => {
    it('should return the current page root node Id', () => {
      const state = {
        app: I.fromJS({ currentUserPageId: 'def' }),
        userPages: I.fromJS({
          abc: { id: 'abc', rootNodeId: '123' },
          def: { id: 'def', rootNodeId: '456' },
          ghi: { id: 'ghi', rootNodeId: '789' }
        })
      }

      expect(nodeSelectors.getRootNodeId(state)).to.equal('456')
    })
  })

  describe('getAllNodeIdsOrdered', () => {
    it('should return an ordered array of all node Ids under a starting node', () => {
      const nodes = I.fromJS({
        abc: { id: 'abc', childIds: ['def', 'ghi'] },
        def: { id: 'def', childIds: [] },
        ghi: { id: 'ghi', childIds: [] }
      })

      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'abc')).to.deep.equal(['abc', 'def', 'ghi'])
    })
  })

  describe('getAllDescendantIds', () => {
    it('should return a flattened, ordered, list of all children node Ids under the root node', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
        eee: { id: 'eee', childIds: [], parentId: 'ddd' }
      })

      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'aaa')).to.deep.equal(['aaa', 'bbb', 'ddd', 'eee', 'ccc'])
    })

    it('should return only the start node id if it is a lowest level descedent', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
        eee: { id: 'eee', childIds: [], parentId: 'ddd' }
      })

      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'ccc')).to.deep.equal(['ccc'])
      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'eee')).to.deep.equal(['eee'])
    })

    it('should return only the start node descendents when the start node is not the root', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
        eee: { id: 'eee', childIds: [], parentId: 'ddd' }
      })

      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'bbb')).to.deep.equal(['bbb', 'ddd', 'eee'])
    })

    it('should not return deleted nodes or their descendants', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', deleted: true },
        eee: { id: 'eee', childIds: [], parentId: 'ddd' }
      })

      expect(nodeSelectors.getAllNodeIdsOrdered(nodes, 'bbb')).to.deep.equal(['bbb'])
    })
  })

  describe('getAncestorIds', () => {
    it('should return an array of ancestors leading to and including the root', () => {
      const userId = '123'
      const nodes = I.fromJS({
        root: { id: 'root', childIds: ['aaa'], collapsedBy: {}, parentId: null },
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], collapsedBy: {}, parentId: 'root' },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], collapsedBy: {}, parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], collapsedBy: {}, parentId: 'ccc' },
        eee: { id: 'eee', childIds: [], collapsedBy: {}, parentId: 'ddd' }
      })

      expect(nodeSelectors.getAncestorIds(nodes, 'root', 'eee'))
        .to.deep.equal(['ddd', 'ccc', 'aaa', 'root'])
    })
  })

  describe('getVisibleNodesIfNodeWasExpanded', () => {
    it('should return a flattened, ordered, list of all children node Ids under a start node ' +
      'that are not collapsed under a parent and does not include the start node Id', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], collapsedBy: {}, parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], collapsedBy: {}, parentId: 'aaa' },
        ddd: { id: 'ddd', childIds: ['eee'], collapsedBy: {}, parentId: 'bbb' },
        eee: { id: 'eee', childIds: [], collapsedBy: {}, parentId: 'ddd' }
      })

      expect(nodeSelectors.getVisibleNodesIfNodeWasExpanded('bbb', nodes, 'bbb', userId))
        .to.deep.equal(['ddd', 'eee'])
    })
  })

  describe('getCurrentlySelectedNodeIds', () => {
    it('should return node Ids that are selected', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: false },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', selected: true },
        eee: { id: 'eee', childIds: [], parentId: 'ddd', selected: true }
      })

      const selectedNodeIds = nodeSelectors.getCurrentlySelectedNodeIds(nodes)

      expect(selectedNodeIds).to.deep.equal(I.List(['ddd', 'eee']))
    })
  })

  describe('getCurrentlyFocusedNodeId', () => {
    it('should return the current node that is focused', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: true },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', focused: true },
        eee: { id: 'eee', childIds: [], parentId: 'ddd', focused: false }
      })

      const focusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(nodes)

      expect(focusedNodeId).to.equal('ddd')
    })

    it('should return the current node that has its notes focused', () => {
      const userId = '123'
      const nodes = I.fromJS({
        aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
        bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
        ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: true, notesFocused: false },
        ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', focused: false },
        eee: { id: 'eee', childIds: [], parentId: 'ddd', notesFocused: true }
      })

      const focusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(nodes)

      expect(focusedNodeId).to.equal('eee')
    })
  })

  describe('getNextNodeThatIsVisible', () => {
    let state
    const userId = '123'
    beforeEach(() => {
      // aaa
      // --bbb
      // ----ccc
      // ----ddd (collapsed)
      // ------eee (hidden)
      // ----fff
      // ------ggg
      // --hhh(deleted)
      // --iii
      state = {
        tree: I.fromJS({
          aaa: { id: 'aaa', childIds: ['bbb', 'hhh', 'iii'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ccc', 'ddd', 'fff'], parentId: 'aaa', visible: true },
          ccc: { id: 'ccc', childIds: [], parentId: 'bbb', visible: true },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', collapsedBy: { '123': userId }, visible: true },
          eee: { id: 'eee', childIds: [], parentId: 'ddd', visible: false },
          fff: { id: 'fff', childIds: ['ggg'], parentId: 'bbb', visible: true },
          ggg: { id: 'ggg', childIds: [], parentId: 'fff', visible: true },
          hhh: { id: 'hhh', childIds: [], parentId: 'aaa', visible: true, deleted: true },
          iii: { id: 'iii', childIds: [], parentId: 'aaa', visible: true }
        }),
        visibleNodes: I.fromJS({
          'aaa': true,
          'bbb': true,
          'ccc': true,
          'ddd': true,
          'eee': false,
          'fff': true,
          'ggg': true,
          'hhh': false,
          'iii': true
        })
      }
    })

    it('should return the sibling nodeId above, if searching above and it is visible', () => {
      const nodeAboveiii = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'iii', true)
      const nodeAbovefff = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'fff', true)
      const nodeAbovebbb = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'bbb', true)

      expect(nodeAboveiii.get('id')).to.equal('ggg')
      expect(nodeAbovefff.get('id')).to.equal('ddd')
      expect(nodeAbovebbb).to.equal(null)
    })

    it('should return the sibling nodeId below, if searching below and it is visible', () => {
      const nodeBelowiii = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'iii', false)
      const nodeBelowbbb = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'bbb', false)
      const nodeBelowccc = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'ccc', false)
      const nodeBelowddd = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'ddd', false)
      const nodeBelowggg = nodeSelectors.getNextNodeThatIsVisible('aaa', state.tree, state.visibleNodes, 'ggg', false)

      expect(nodeBelowiii).to.equal(null)
      expect(nodeBelowbbb.get('id')).to.equal('ccc')
      expect(nodeBelowccc.get('id')).to.equal('ddd')
      expect(nodeBelowddd.get('id')).to.equal('fff')
      expect(nodeBelowddd.get('id')).to.equal('fff')
      expect(nodeBelowggg.get('id')).to.equal('iii')
    })
  })

  // describe('getNodeDataForComponent', () => {
  //   it('should do something...', () => {

  //   })
  // })
})
