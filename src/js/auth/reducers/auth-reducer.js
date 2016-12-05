import reducerFactory from '../../redux/reducer-factory'
import * as I from 'immutable'
import {
  UPDATE_AUTH_STATE,
  SIGN_IN_SUCCESS,
  SIGN_IN_ERROR
} from '../actions/auth-action-types'

const initialAuthState = I.Map({
  authenticated: false,
  id: null
})

export const auth = reducerFactory(initialAuthState, {
  [UPDATE_AUTH_STATE]: (state, action) => {
    return updateAuthState(state, action)
  },
  [SIGN_IN_SUCCESS]: (state, action) => {
    return updateAuthState(state, action)
  },
  [SIGN_IN_ERROR]: (state, action) => {
    return I.Map({
      authenticated: false,
      id: null
    })
  }
})

function updateAuthState (state, action) {
  return state.merge({
    initialCheck: true,
    authenticated: !!action.payload,
    id: action.payload ? action.payload.uid : null,
    displayName: action.payload ? action.payload.displayName : null,
    email: action.payload ? action.payload.email : null
  })
}
