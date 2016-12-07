import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from './root-reducer'
import { observeTreeStore } from '../node/observe-tree-store'

const loggerMiddleware = createLogger()
export let store = null

export default function configureStore (preloadedState) {
  store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )

  observeTreeStore(store)

  return store
}
