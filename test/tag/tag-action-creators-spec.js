// import * as tagActionCreators from '../../src/js/tag/tag-action-creators'
// import * as tagFirebaseActions from '../../src/js/tag/tag-firebase-actions'
// import * as tagActions from '../../src/js/tag/tag-actions'
// import * as nodeActionCreators from '../../src/js/node/node-action-creators'
// import sinon from 'sinon'
// import { expect } from 'chai'

// describe('tag action creators', () => {
//   let getState
//   let dispatch
//   let userId = 111
//   const addTagToNodeActionCreatorStub = {}
//   const tagFirebaseCreateTagActionStub = {}

//   beforeEach(() => {
//     sinon.stub(nodeActionCreators, 'addTagToNode', () => (addTagToNodeActionCreatorStub))
//     sinon.stub(tagFirebaseActions, 'createTag', () => (tagFirebaseCreateTagActionStub))
//     getState = () => {
//       return {
//         app: {
//           currentUserPageId: '12345'
//         },
//         tags: [
//           {
//             type: '#',
//             id: '#inprogress',
//             label: 'InProgress'
//           },
//           {
//             type: '#',
//             id: '#todo',
//             label: 'ToDo'
//           }
//         ],
//         auth: { id: userId }
//       }
//     }
//     dispatch = sinon.spy()
//   })

//   afterEach(() => {
//     nodeActionCreators.addTagToNode.restore()
//     tagFirebaseActions.createTag.restore()
//   })

//   describe('createTag', () => {
//     it('should not create a duplicate tag', () => {
//       tagActionCreators.createTag('#', 'ToDo', '123')(dispatch, getState)
//       expect(dispatch).to.not.have.been.called
//     })

//     it('should dispatch a tagCreated and a addTagToNode', () => {
//       tagActionCreators.createTag('#', 'New Tag', '123')(dispatch, getState)

//       expect(dispatch).to.have.been.calledWith(tagActions.tagCreated('#', '#new tag', 'New Tag'))
//       expect(dispatch).to.have.been.calledWith(addTagToNodeActionCreatorStub)
//       expect(dispatch).to.have.been.calledWith(tagFirebaseCreateTagActionStub)
//     })
//   })
// })

