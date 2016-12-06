import * as appActionCreators from '../../../src/js/app/app-action-creators'
import * as appActions from '../../../src/js/app/app-actions'
import * as nodeActions from '../../../src/js/node/actions/node-actions'
import * as nodeSelectors from '../../../src/js/node/selectors/node-selectors'
import * as nodeSubscriptions from '../../../src/js/node/subscriptions/node-subscriptions'
import sinon from 'sinon'
import { expect } from 'chai'
import * as I from 'immutable'

describe('app action creators', () => {
  const initialTreeState = {}
  const dispatch = sinon.spy()
  const getState = () => ({
    auth: I.Map({
      id: 'user123'
    })
  })
  const userPageNavigationActionStub = { userPageNavigation: true }
  const initialTreeStateLoadActionStub = { initialTreeStateLoad: true }
  const sidePanelToggleActionStub = { sidePanelToggle: true }

  beforeEach(() => {
    sinon.stub(nodeSelectors, 'getRootNodeId', (state) => ('1'))
    sinon.stub(nodeSubscriptions, 'initializeNodeSubscriptions', (userPageId, userId) => (Promise.resolve(initialTreeState)))
    sinon.stub(appActions, 'userPageNavigation', (userPageId) => (userPageNavigationActionStub))
    sinon.stub(appActions, 'sidePanelToggle', () => (sidePanelToggleActionStub))
    sinon.stub(nodeActions, 'initialTreeStateLoad', () => (initialTreeStateLoadActionStub))
  })

  afterEach(() => {
    nodeSelectors.getRootNodeId.restore()
    nodeSubscriptions.initializeNodeSubscriptions.restore()
    nodeActions.initialTreeStateLoad.restore()
    appActions.sidePanelToggle.restore()
    appActions.userPageNavigation.restore()
  })

  describe('navigateToUserPage', () => {
    it('should dispatch a userPageNavigation, initialize node subscriptions, and dispatch initialTreeStateLoad', (done) => {
      appActionCreators.navigateToUserPage('userpage123')(dispatch, getState)

      expect(appActions.userPageNavigation).to.have.been.calledWith('userpage123')
      expect(dispatch).to.have.been.calledWith(userPageNavigationActionStub)

      expect(nodeSubscriptions.initializeNodeSubscriptions).to.have.been.calledWith('userpage123', 'user123')

      setTimeout(() => {
        expect(dispatch).to.have.been.calledWith(initialTreeStateLoadActionStub)
        done()
      }, 0)
    })
  })
  describe('togglePagesSidePanel', () => {
    it('should create a sidePanelToggle action', () => {
      appActionCreators.togglePagesSidePanel()(dispatch, getState)

      expect(appActions.sidePanelToggle).to.have.been.called
      expect(dispatch).to.have.been.calledWith(sidePanelToggleActionStub)
    })
  })
})
