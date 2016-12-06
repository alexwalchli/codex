import * as userPageActionCreators from '../../src/js/userpage/userpage-action-creators'
import * as userPageRepository from '../../src/js/userpage/userpage-repository'
import * as userPageActions from '../../src/js/userpage/userpage-actions'
import * as userPageOperations from '../../src/js/userpage/userpage-operations'
import * as nodeRepository from '../../src/js/node/node-repository'
import * as nodeOperations from '../../src/js/node/node-operations'
import * as appActionCreators from '../../src/js/app/app-action-creators'
import * as I from 'immutable'
import sinon from 'sinon'
import { expect } from 'chai'

describe('userPageActionCreators', () => {
  const userId = 'user123'
  const dispatch = sinon.spy()
  const auth = I.fromJS({
    id: userId
  })
  const userPage = I.fromJS({ id: '1', rootNodeId: '1', isHome: true })
  const rootNode = I.fromJS({ id: '1' })
  const state = {
    tree: I.fromJS({
      '1': rootNode
    }),
    userPages: I.fromJS({
      '1': userPage
    }),
    auth
  }
  const getState = () => (state)
  const newNodeId = 'node123'
  const newNode = {}
  const newUserPageId = 'userPage123'
  const newUserPage = {}
  const userPageNavigationActionStub = { navigateToUserPage: true }
  const userPageDeletionActionStub = { userPageDeletion: true }
  const userPageNameUpdateActionStub = { userPageNameUpdate: true }
  beforeEach(() => {
    sinon.stub(nodeRepository, 'getNewNodeId', () => (newNodeId))
    sinon.stub(nodeOperations, 'makeNode', () => (newNode))
    sinon.stub(userPageOperations, 'makeUserPage', () => (newUserPage))
    sinon.stub(userPageRepository, 'getNewUserPageId', () => (newUserPageId))
    sinon.stub(userPageRepository, 'createUserPage', (newUserPage, newRootNode, newFirstNode) => (Promise.resolve(newUserPage)))
    sinon.stub(userPageRepository, 'deleteUserPage', (userPageId) => (Promise.resolve()))
    sinon.stub(userPageRepository, 'updateUserPageName', (userPageId, name) => (Promise.resolve()))
    sinon.stub(appActionCreators, 'navigateToUserPage', () => (userPageNavigationActionStub))
    sinon.stub(userPageActions, 'userPageDeletion', () => (userPageDeletionActionStub))
    sinon.stub(userPageActions, 'userPageNameUpdate', () => (userPageNameUpdateActionStub))
  })

  afterEach(() => {
    nodeRepository.getNewNodeId.restore()
    nodeOperations.makeNode.restore()
    userPageOperations.makeUserPage.restore()
    userPageRepository.getNewUserPageId.restore()
    userPageRepository.createUserPage.restore()
    appActionCreators.navigateToUserPage.restore()
    userPageRepository.deleteUserPage.restore()
    userPageRepository.updateUserPageName.restore()
    userPageActions.userPageDeletion.restore()
    userPageActions.userPageNameUpdate.restore()
  })

  describe('createUserPage', () => {
    it('should create a userPage then navigate to the new userPage', (done) => {
      userPageActionCreators.createUserPage('Home', true)(dispatch, getState)

      expect(nodeOperations.makeNode).to.have.been.calledWith(newNodeId, null, [newNodeId], '', userId)
      expect(nodeOperations.makeNode).to.have.been.calledWith(newNodeId, newNodeId, [], '', userId)
      expect(userPageOperations.makeUserPage).to.have.been.calledWith(newUserPageId, newNodeId, userId, 'Home', true)
      expect(userPageRepository.createUserPage).to.have.been.calledWith(newUserPage, newNode, newNode)

      setTimeout(() => {
        expect(appActionCreators.navigateToUserPage).to.have.been.calledWith(newUserPageId)
        expect(dispatch).to.have.been.calledWith(userPageNavigationActionStub)
        done()
      }, 0)
    })
  })
  describe('deleteUserPage', () => {
    it('should delete the page from persistence and state and then navigate to the home page', () => {
      userPageActionCreators.deleteUserPage('1')(dispatch, getState)

      expect(userPageRepository.deleteUserPage).to.have.been.calledWith(userPage, rootNode, auth)
      expect(appActionCreators.navigateToUserPage).to.have.been.calledWith('1')
      expect(userPageActions.userPageDeletion).to.have.been.calledWith('1')
      expect(dispatch).to.have.been.calledWith(userPageNavigationActionStub)
      expect(dispatch).to.have.been.calledWith(userPageDeletionActionStub)
    })
  })
  describe('updateUserPageName', () => {
    it('should update the page in persistence and state', () => {
      userPageActionCreators.updateUserPageName('1', 'new name')(dispatch, getState)

      expect(userPageRepository.updateUserPageName).to.have.been.calledWith(userPage, 'new name')
      expect(dispatch).to.have.been.calledWith(userPageNameUpdateActionStub)
    })
  })
  // describe('shareUserPage', () => {
  //   it('should share the page via userPageRepository', () => {

  //   })
  // })
})
