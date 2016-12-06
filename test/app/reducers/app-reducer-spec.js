import { app } from '../../../src/js/app/app-reducer'
import * as appActions from '../../../src/js/app/app-actions'
import { expect } from 'chai'
import * as I from 'immutable'

describe('appReducer', () => {
  describe('SHARE_DROP_DOWN_TOGGLE', () => {
    it('should toggle the shareDropdownVisible attribute', () => {
      const shareDropDownToggleAction = appActions.shareDropdownToggle()

      const newState = app(I.Map({}), shareDropDownToggleAction)

      expect(newState.get('shareDropdownVisible')).to.equal(true)
    })
  })
  describe('SIDE_PANEL_TOGGLE', () => {
    it('should toggle the pagesSidePanelVisible attribute', () => {
      const sidePanelToggleAction = appActions.sidePanelToggle()

      const newState = app(I.Map({}), sidePanelToggleAction)

      expect(newState.get('pagesSidePanelVisible')).to.equal(true)
    })
  })
  describe('USER_PAGE_NAVIGATION', () => {
    it('should set the current User Page Id', () => {
      const userPageNavigation = appActions.userPageNavigation('userpage123')

      const newState = app(I.Map({}), userPageNavigation)

      expect(newState.get('currentUserPageId')).to.equal('userpage123')
    })
  })
})
