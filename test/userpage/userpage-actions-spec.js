import * as userPageActions from '../../src/js/userpage/userpage-actions'
import * as userPageActionTypes from '../../src/js/userpage/userpage-action-types'
import { expect } from 'chai'

describe('userpageActions', () => {
  describe('userPageCreation', () => {
    it('should create a userPageCreation action', () => {
      const userPage = { id: 'userpage123' }
      const rootNode = { id: 'rootnode' }
      const firstNode = { id: 'firstnode' }
      expect(userPageActions.userPageCreation(userPage, rootNode, firstNode)).to.deep.equal({
        type: userPageActionTypes.USER_PAGE_CREATION,
        payload: {
          userPage,
          rootNode,
          firstNode
        }
      })
    })
  })
  describe('userPageDeletion', () => {
    it('should create a userPageDeletion action', () => {
      const userPageId = 'userpage123'
      expect(userPageActions.userPageDeletion(userPageId)).to.deep.equal({
        type: userPageActionTypes.USER_PAGE_DELETION,
        payload: { userPageId }
      })
    })
  })
  describe('userPageNameUpdate', () => {
    it('should create a userPageNameUpdate action', () => {
      const userPageId = 'userpage123'
      const newUserPageName = 'user page name'
      expect(userPageActions.userPageNameUpdate(userPageId, newUserPageName)).to.deep.equal({
        type: userPageActionTypes.USER_PAGE_NAME_UPDATE,
        payload: {
          userPageId,
          newUserPageName
        }
      })
    })
  })
})
