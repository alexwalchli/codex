import React, { Component } from 'react'
import * as userPageRepository from './userpage-repository'
import * as userPageActionCreators from '../../userpage/userpage-action-creators'

export class AppSubscriptions extends Component {

  componentDidMount () {
    // tryInitializeSubscriptions()
  }

  componentDidUpdate () {
    // tryInitializeSubscriptions()
  }

  tryInitializeSubscriptions () {
    const { userPageId, userIsAuthenticated } = this.props

    if(!userIsAuthenticated){
      return
    }

    let initialAppState = {}

    userPageRepository.getUserPages(userId).then(userPages => {
      if (!userPages || userPages.count() === 0) {
        // makeUserPage
        // dispatch(userPageActionCreators.createUserPage('Home', true))
      } else {
        userPages.forEach(userPage => {
          dispatch(userPageActions.userPageCreation(userPage))
        })

        dispatch(appActionCreators.navigateToUserPage(userPages.find(u => u.get('isHome')).get('id')))
      }

      initialAppState.userPages = userPages

      this.startNodeSubscriptions()
        .then(initialTreeState => {
          initialAppState.tree = initialTreeState
        })

      // initialStateLoad

      // navigateToUserPage

      // firebaseDb.ref('userPages/' + userId).on('child_added', snapshot => onUserPageCreated(snapshot, dispatch))
    })

    // get user pages
    // get nodes

    // dispatch(navigateToUserPage)
    // dispatch(initialTreeLoad() )
  }

  startNodeSubscriptions () {
    return new Promise((resolve, reject) => {
      let initialNodePromises = []

      userPageUsersNodesRepository.getNodeIds(userPageId, userId).then(nodeIds => {
        let initialTreeState = {}

        const userPageUserNodesRef = firebaseDb.ref(`userPage_users_nodes/${userPageId}/${userId}`)
        userPageUserNodesRef.on('child_added', onNodeCreated)
        userPageUserNodesRef.on('child_removed', onNodeDeleted)

        nodeIds.forEach(nodeId => {
          let nodePromise = new Promise((resolve, reject) => {
            nodeRepository.getNode(nodeId)
                .then(node => {
                  // clean up nodes each time we initialize subs
                  if (node.deleted) {
                    nodeRepository.permanentlyDeleteNode(nodeId, userPageId, userId)
                  } else {
                    initialTreeState[nodeId] = node
                    const nodeRef = firebaseDb.ref('nodes/' + nodeId)
                    nodeRef.on('value', onNodeUpdated)
                  }
                  resolve()
                })
          })
          initialNodePromises.push(nodePromise)
        })

        Promise.all(initialNodePromises).then(() => {
          resolve(I.Map(initialTreeState))
        }).catch(error => {
          console.error('Error while initializing node subscriptions: ' + error.message)
        })
      })
    })
  }

  onUserPageAdded () {
    // dispatch()
  }

  onNodeAdded () {

  }

  onNodeUpdated () {

  }

  onNodeDeleted () {

  }

  render () {
    return null
  }

}
