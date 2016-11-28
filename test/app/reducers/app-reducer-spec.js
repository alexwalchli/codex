import { app } from '../../../src/js/app/reducers/app-reducer'
import * as appActions from '../../../src/js/app/actions/app-actions'
import { expect } from 'chai'

describe('appReducer', () => {
  describe('SHARE_DROP_DOWN_TOGGLE', () => {
    it('should toggle the shareDropdownVisible attribute', () => {
      const shareDropDownToggleAction = appActions.shareDropdownToggle()

      const newState = app({}, shareDropDownToggleAction)

      expect(newState.shareDropdownVisible).to.equal(true)
    })
  })
  describe('SIDE_PANEL_TOGGLE', () => {
    it('should toggle the pagesSidePanelVisible attribute', () => {
      const sidePanelToggleAction = appActions.sidePanelToggle()

      const newState = app({}, sidePanelToggleAction)

      expect(newState.pagesSidePanelVisible).to.equal(true)
    })
  })
  describe('USER_PAGE_NAVIGATION', () => {
    it('should set the current User Page Id', () => {
      const userPageNavigation = appActions.userPageNavigation('userpage123')

      const newState = app({}, userPageNavigation)

      expect(newState.currentUserPageId).to.equal('userpage123')
    })
  })
})
