// import * as tagFirebaseActions from '../../src/js/tag/tag-firebase-actions'
// import * as firebaseRequestQueueActionCreators from '../../src/js/requestqueue/actions/firebase-request-queue-action-creators'
// import { firebaseDb } from '../../src/js/firebase'
// import sinon from 'sinon'
// import { expect } from 'chai'

// describe('tag firebase actions', () => {
//   let dispatch
//   let firebaseUpdateSpy

//   beforeEach(() => {
//     dispatch = sinon.spy()

//     sinon.stub(firebaseRequestQueueActionCreators, 'enqueueRequest', (ctx, req) => {
//       req()
//     })
//   })

//   afterEach(() => {
//     firebaseRequestQueueActionCreators.enqueueRequest.restore()
//     firebaseDb.ref.restore()
//   })

//   describe('createTag', () => {
//     it('should add the tag to userpage_tags', () => {
//       const tagId = '#todo'
//       const userPageId = '12345'
//       firebaseUpdateSpy = sinon.spy()
//       sinon.stub(firebaseDb, 'ref', () => ({ update: firebaseUpdateSpy }))
//       tagFirebaseActions.createTag(tagId, userPageId)(dispatch)

//       expect(firebaseUpdateSpy).to.have.been.calledWith({
//         [`userpage_tags/${userPageId}/${tagId}`]: true
//       })
//     })
//   })

//   describe('deleteTag', () => {
//     it('should remove the correct ref from userpage_tags', () => {
//       const tagId = '#todo'
//       const userPageId = '12345'
//       const firebaseRemoveSpy = sinon.spy()
//       const firebaseDbRefStub = sinon.stub(firebaseDb, 'ref', (refQuery) => ({ remove: firebaseRemoveSpy }))

//       tagFirebaseActions.deleteTag(tagId, userPageId)(dispatch)

//       expect(firebaseDbRefStub).to.have.been.calledWith(`userpage_tags/${userPageId}/${tagId}`)
//       expect(firebaseRemoveSpy).to.have.been.called
//     })
//   })
// })
