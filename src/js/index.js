import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './redux/configure-store'
import App from './app/components/app'
import { subscribeToAuthStateChanged } from './auth/auth-subscriptions'
import * as nodeSelectors from './node/node-selectors'

require('../less/app.less')

startApplication()

function startApplication () {
  const store = configureStore()

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  )

  subscribeToAuthStateChanged(store.dispatch)

  window.dev = {}
  window.dev.store = store
  window.dev.validateTree = validateTree
}

function validateTree() {
  const state = window.dev.store.getState()
  const rootNodeId = nodeSelectors.getRootNodeId(state)
  let allNodeIds = []
  try {
    allNodeIds = nodeSelectors.getAllNodeIdsOrdered(state.tree, rootNodeId)
  } catch (error) {
     console.error(`Error getting all nodeIds. This can happen if there's a gap in the childIds: ${error}`)
     return
  }

  let visitedNodeIds = {}
  allNodeIds.forEach(nodeId => {
    if(visitedNodeIds[nodeId]) {
      throw new Error(`Node found twice: ${nodeId}`)
    }

    visitedNodeIds[nodeId]
  })
}

