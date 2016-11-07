import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './redux/configure-store'
import App from './app/components/app'
import { subscribeToAuthStateChanged } from './auth/actions/auth-firebase-subscriptions'

require('../less/app.less')

const store = configureStore({
  tree: {},
  auth: {},
  userPages: {}
})

render(
  <Provider store={store}>
    <App />
  </Provider>,
    document.getElementById('root')
)

subscribeToAuthStateChanged(store.dispatch)
