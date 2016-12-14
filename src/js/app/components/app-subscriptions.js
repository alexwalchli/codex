// import React, { Component } from 'react'
// import * as userPageRepository from '../../userpage/userpage-repository'
// import * as userPageActionCreators from '../../userpage/userpage-action-creators'
// import * as userPageOperations from '../../userpage/userpage-operations'

// export class AppSubscriptions extends Component {

//   componentDidMount () {
//     // tryStartSubscriptions()
//   }

//   componentDidUpdate () {
//     // tryStartSubscriptions()
//   }

//   tryStartSubscriptions () {
//     const { userPageId, userId, userIsAuthenticated } = this.props

//     if (!userIsAuthenticated) {
//       return
//     }

//     let initialAppState = {}

//     userPageRepository.getUserPages(userId).then(userPages => {
//       if (!userPageId || !userPages || userPages.count() === 0) {
//         // TODO:
//         // dispatch(userPageActionCreators.createUserPage('Home', true))
//       }

//       initialAppState.userPages = userPages

//       this.startNodeSubscriptions()
//         .then(initialTreeState => {
//           initialAppState.tree = initialTreeState

//           dispatch(loadInitialState(initialAppState))
//           dispatch(navigateToUserPage(userPageId))
//         })

//       // firebaseDb.ref('userPages/' + userId).on('child_added', snapshot => onUserPageCreated(snapshot, dispatch))
//     })
//   }

//   startNodeSubscriptions () {
//     return new Promise((resolve, reject) => {
//       let initialNodePromises = []

//       userPageUsersNodesRepository.getNodeIds(userPageId, userId).then(nodeIds => {
//         let initialTreeState = {}

//         const userPageUserNodesRef = firebaseDb.ref(`userPage_users_nodes/${userPageId}/${userId}`)
//         userPageUserNodesRef.on('child_added', onNodeCreated)
//         userPageUserNodesRef.on('child_removed', onNodeDeleted)

//         nodeIds.forEach(nodeId => {
//           let nodePromise = new Promise((resolve, reject) => {
//             nodeRepository.getNode(nodeId)
//                 .then(node => {
//                   // clean up nodes each time we initialize subs
//                   if (node.deleted) {
//                     nodeRepository.permanentlyDeleteNode(nodeId, userPageId, userId)
//                   } else {
//                     initialTreeState[nodeId] = node
//                     const nodeRef = firebaseDb.ref('nodes/' + nodeId)
//                     nodeRef.on('value', onNodeUpdated)
//                   }
//                   resolve()
//                 })
//           })
//           initialNodePromises.push(nodePromise)
//         })

//         Promise.all(initialNodePromises).then(() => {
//           resolve(I.Map(initialTreeState))
//         }).catch(error => {
//           console.error('Error while initializing node subscriptions: ' + error.message)
//         })
//       })
//     })
//   }

//   onUserPageAdded () {
//     // dispatch()
//   }

//   onNodeAdded (node) {
//     if (this.wasNotUpdatedByCurrentUser(node)) {
//       dispatch(nodeSubscriptionOnAdded(node.id))
//     }
//   }

//   onNodeUpdated (node) {
//     if (this.wasNotUpdatedByCurrentUser(node)) {
//       dispatch(nodeSubscriptionOnUpdated(node.id))
//     }
//   }

//   onNodeDeleted (node) {
//     if (this.wasNotUpdatedByCurrentUser(node)) {
//       dispatch(nodeSubscriptionOnDelete(node.id))
//     }
//   }

//   wasNotUpdatedByCurrentUser (node) {
//     const { userId } = this.props
//     if (node.lastUpdatedById === userId || (!node.lastUpdatedById && node.createdById === userId)) {
//       return false
//     }
//     return true
//   }

//   render () {
//     return null
//   }

// }
