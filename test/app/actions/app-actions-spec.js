import * as appActions from '../../../src/js/app/actions/app-actions'
import * as appActionTypes from '../../../src/js/app/actions/app-action-types'
import { expect } from 'chai'

describe('app actions', () => {
  describe('shareDropdownToggle', () => {
    it('should shareDropdownToggle action', () => {
      expect(appActions.shareDropdownToggle()).to.deep.equal({
        type: appActionTypes.SHARE_DROPDOWN_TOGGLE
      })
    })
  })
  describe('sidePanelToggle', () => {
    it('should create a sidePanelToggle action', () => {
      expect(appActions.sidePanelToggle()).to.deep.equal({
        type: appActionTypes.SIDE_PANEL_TOGGLE
      })
    })
  })
  describe('userPageNavigation', () => {
    it('should create a userPageNavigation action', () => {
      expect(appActions.userPageNavigation('userPage123')).to.deep.equal({
        type: appActionTypes.USER_PAGE_NAVIGATION,
        payload: {
          userPageId: 'userPage123'
        }
      })
    })
  })
})
