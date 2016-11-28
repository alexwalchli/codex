import * as userPageActionCreators from '../../../src/js/userpage/actions/userpage-action-creators'
import * as userPageRepository from '../../../src/js/userpage/repositories/userpage-repository'
import * as nodeRepository from '../../../src/js/node/repositories/node-repository'
import { expect } from 'chai'

describe('userPageActionCreators', () => {
  const dispatch = sinon.spy()
  const getState = () => ({

  })

  describe('createUserPage', () => {
    it('should create a userPage then navigate to the new userPage', () => {

    })
  })
  describe('initializeUserHomePage', () => {
    it('should create a userPage then navigate to the new userPage', () => {

    })
  })
  describe('deleteUserPage', () => {
    it('should delete the page from persistence and state and then navigate to the home page', () => {

    })
  })
  describe('updateUserPageName', () => {
    it('should update the page in persistence and state', () => {

    })
  })
  describe('shareUserPage', () => {
    it('should share the page via userPageRepository', () => {
      
    })
  })
})