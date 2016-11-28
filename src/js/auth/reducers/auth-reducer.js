import * as authActionTypes from '../actions/auth-action-types'
import reducerFactory from '../../redux/reducer-factory'

const initialAuthState = {
  authenticated: false,
  id: null
}

export const auth = reducerFactory(initialAuthState, {
  [UPDATE_AUTH_STATE]: (state, action) => {
    return this.[SIGN_IN_SUCCESS](state, action)
  },
  [SIGN_IN_SUCCESS]: (state, action) => {
    return Object.assign(state, {
      initialCheck: true,
      authenticated: !!payload,
      id: payload ? payload.uid : null,
      displayName: payload ? payload.displayName : null,
      email: payload ? payload.email : null
    })
  },
  [SIGN_OUT_SUCCESS]: (state, action) => {
    return {
      authenticated: false,
      id: null
    }
  }
})
