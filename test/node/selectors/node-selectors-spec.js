import * as nodeSelectors from '../../../src/js/node/selectors/node-selectors'
import { expect } from 'chai'

describe('nodeSelectors', () => {
  describe('getPresentNodes', () => {
    it('should return the present nodes', () => {
      const appState = {
        tree: {
          present: {
            abc: { id: 1 },
            def: { id: 1, deleted: true }
          },
          past: {
            abc: { id: 1 },
            def: { id: 2 }
          }
        }
      }

      var presentNodes = nodeSelectors.getPresentNodes(appState)

      expect(presentNodes).to.deep.equal({ abc: { id: 1 } })
    })
  })

  describe('getRootNodeId', () => {
    it('should return the current page root node Id', () => {
      const appState = {
        app: { currentUserPageId: 'def' },
        userPages: {
          abc: { id: 'abc', rootNodeId: '123' },
          def: { id: 'def', rootNodeId: '456' },
          ghi: { id: 'ghi', rootNodeId: '789' }
        }
      }

      expect(nodeSelectors.getRootNodeId(appState)).to.equal('456')
    })
  })

  describe('getAllNodeIdsOrdered', () => {
    it('should return an ordered array of all node Ids under a starting node', () => {
      const appState = {
        nodes: {
          abc: { id: 'abc', childIds: ['def', 'ghi'] },
          def: { id: 'def', childIds: [] },
          ghi: { id: 'ghi', childIds: [] }
        }
      }

      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'abc')).to.deep.equal(['abc', 'def', 'ghi'])
    })
  })

  describe('getAllDescendantIds', () => {
    it('should return a flattened, ordered, list of all children node Ids under the root node', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
          eee: { id: 'eee', childIds: [], parentId: 'ddd' }
        }
      }

      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'aaa')).to.deep.equal(['aaa', 'bbb', 'ddd', 'eee', 'ccc'])
    })

    it('should return only the start node id if it is a lowest level descedent', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
          eee: { id: 'eee', childIds: [], parentId: 'ddd' }
        }
      }

      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'ccc')).to.deep.equal(['ccc'])
      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'eee')).to.deep.equal(['eee'])
    })

    it('should return only the start node descendents when the start node is not the root', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb' },
          eee: { id: 'eee', childIds: [], parentId: 'ddd' }
        }
      }

      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'bbb')).to.deep.equal(['bbb', 'ddd', 'eee'])
    })

    it('should not return deleted nodes or their descendants', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa' },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', deleted: true },
          eee: { id: 'eee', childIds: [], parentId: 'ddd' }
        }
      }

      expect(nodeSelectors.getAllNodeIdsOrdered(appState.nodes, 'bbb')).to.deep.equal(['bbb'])
    })
  })

  describe('getAllUncollapsedDescedantIds', () => {
    it('should return a flattened, ordered, list of all children node Ids under a start node ' +
      'that are not collapsed under a parent and does not include the start node Id', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], collapsedBy: {}, parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], collapsedBy: {}, parentId: 'aaa' },
          ddd: { id: 'ddd', childIds: ['eee'], collapsedBy: {}, parentId: 'bbb' },
          eee: { id: 'eee', childIds: [], collapsedBy: {}, parentId: 'ddd' }
        }
      }

      expect(nodeSelectors.getAllUncollapsedDescedantIds('aaa', appState.nodes, 'aaa', userId)).to.deep.equal(['bbb', 'ccc'])
    })
  })

  describe('getCurrentlySelectedNodeIds', () => {
    it('should return node Ids that are selected', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: false },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', selected: true },
          eee: { id: 'eee', childIds: [], parentId: 'ddd', selected: true }
        }
      }

      const selectedNodeIds = nodeSelectors.getCurrentlySelectedNodeIds(appState.nodes)

      expect(selectedNodeIds).to.deep.equal(['ddd', 'eee'])
    })
  })

  describe('getCurrentlyFocusedNodeId', () => {
    it('should return the current node that is focused', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: true },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', focused: true },
          eee: { id: 'eee', childIds: [], parentId: 'ddd', focused: false }
        }
      }

      const focusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(appState.nodes)

      expect(focusedNodeId).to.equal('ddd')
    })

    it('should return the current node that has its notes focused', () => {
      const userId = '123'
      const appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'ccc'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ddd'], collapsedBy: { '123': userId }, parentId: 'aaa' },
          ccc: { id: 'ccc', childIds: [], parentId: 'aaa', selected: true, notesFocused: false },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', focused: false },
          eee: { id: 'eee', childIds: [], parentId: 'ddd', notesFocused: true }
        }
      }

      const focusedNodeId = nodeSelectors.getCurrentlyFocusedNodeId(appState.nodes)

      expect(focusedNodeId).to.equal('eee')
    })
  })

  describe('getNextNodeThatIsVisible', () => {
    let appState
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
      appState = {
        nodes: {
          aaa: { id: 'aaa', childIds: ['bbb', 'hhh', 'iii'], parentId: null },
          bbb: { id: 'bbb', childIds: ['ccc', 'ddd', 'fff'], parentId: 'aaa', visible: true },
          ccc: { id: 'ccc', childIds: [], parentId: 'bbb', visible: true },
          ddd: { id: 'ddd', childIds: ['eee'], parentId: 'bbb', collapsedBy: { '123': userId }, visible: true },
          eee: { id: 'eee', childIds: [], parentId: 'ddd', visible: false },
          fff: { id: 'fff', childIds: ['ggg'], parentId: 'bbb', visible: true },
          ggg: { id: 'ggg', childIds: [], parentId: 'fff', visible: true },
          hhh: { id: 'hhh', childIds: [], parentId: 'aaa', visible: true, deleted: true },
          iii: { id: 'iii', childIds: [], parentId: 'aaa', visible: true }
        },
        visibleNodes: {
          'aaa': true,
          'bbb': true,
          'ccc': true,
          'ddd': true,
          'eee': false,
          'fff': true,
          'ggg': true,
          'hhh': false,
          'iii': true
        }
      }
    })

    it('should return the sibling nodeId above, if searching above and it is visible', () => {
      const nodeAboveiii = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'iii', true)
      const nodeAbovefff = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'fff', true)
      const nodeAbovebbb = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'bbb', true)

      expect(nodeAboveiii.id).to.equal('ggg')
      expect(nodeAbovefff.id).to.equal('ddd')
      expect(nodeAbovebbb).to.equal(null)
    })

    it('should return the sibling nodeId below, if searching below and it is visible', () => {
      const nodeBelowiii = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'iii', false)
      const nodeBelowbbb = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'bbb', false)
      const nodeBelowccc = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'ccc', false)
      const nodeBelowddd = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'ddd', false)
      const nodeBelowggg = nodeSelectors.getNextNodeThatIsVisible('aaa', appState.nodes, appState.visibleNodes, 'ggg', false)

      expect(nodeBelowiii).to.equal(null)
      expect(nodeBelowbbb.id).to.equal('ccc')
      expect(nodeBelowccc.id).to.equal('ddd')
      expect(nodeBelowddd.id).to.equal('fff')
      expect(nodeBelowddd.id).to.equal('fff')
      expect(nodeBelowggg.id).to.equal('iii')
    })
  })

  describe('getNodeDataForComponent', () => {
    it('should do something...', () => {

    })
  })
})
