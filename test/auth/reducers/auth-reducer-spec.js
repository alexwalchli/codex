import { auth } from '../../../src/js/auth/reducers/auth-reducer'
import * as authActions from '../../../src/js/auth/actions/auth-actions'
import { expect } from 'chai'
import * as I from 'immutable'

describe('authReducer', () => {
  const user = {
    uid: '123',
    displayName: 'Alex Walchli',
    email: 'someemail@gmail.com'
  }
  describe('UPDATE_AUTH_STATE', () => {
    it('should return update auth state', () => {
      const updateAuthStateAction = authActions.updateAuthState(user)
      const newState = auth(I.Map({}), updateAuthStateAction)

      expect(newState).to.deep.equal(I.Map({
        initialCheck: true,
        authenticated: true,
        id: user.uid,
        displayName: user.displayName,
        email: user.email
      }))
    })
  })
  describe('SIGN_IN_SUCCESS', () => {
    it('should return updated auth state', () => {
      const signInSuccessAction = authActions.signInSuccess({ user })
      const newState = auth(I.Map({}), signInSuccessAction)

      expect(newState).to.deep.equal(I.Map({
        initialCheck: true,
        authenticated: true,
        id: user.uid,
        displayName: user.displayName,
        email: user.email
      }))
    })
  })
  describe('SIGN_IN_ERROR', () => {
    it('should clear the auth state', () => {
      const signInErrorAction = authActions.signInError()
      const newState = auth(I.Map({}), signInErrorAction)

      expect(newState).to.deep.equal(I.Map({
        authenticated: false,
        id: null
      }))
    })
  })
})
