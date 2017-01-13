// import * as tagActions from '../../src/js/tag/tag-actions'
// import { INITIAL_NODE_STATE_LOADED } from '../../src/js/node/node-action-types'
// import * as tagsReducer from '../../src/js/tag/tag-reducer'
// import { expect } from 'chai'

// describe('tags reducer', () => {
//   const initialTagsState = [
//     {
//       type: '#',
//       id: 'inprogress',
//       label: 'InProgress'
//     },
//     {
//       type: '#',
//       id: 'todo',
//       label: 'ToDo'
//     },
//     {
//       type: '#',
//       id: 'learning',
//       label: 'Learning'
//     }
//   ]
//   const initialNodeStateLoaded = {
//     type: INITIAL_NODE_STATE_LOADED,
//     payload: {
//       rootNodeId: '1',
//       initialTagsState,
//       userId: '09876'
//     }
//   }

//   describe('INITIAL_NODE_STATE_LOADED', () => {
//     it('should initialize tags state', () => {
//       const newState = tagsReducer.tags({}, initialNodeStateLoaded)

//       expect(newState).to.deep.equal(initialTagsState)
//     })
//   })

//   describe('TAG_CREATED', () => {
//     it('should add the tag to state', () => {
//       const initialState = tagsReducer.tags({}, initialNodeStateLoaded)
//       const newState = tagsReducer.tags(initialState, tagActions.tagCreated('#', 'reading', 'reading'))

//       expect(newState).to.deep.equal([
//         {
//           type: '#',
//           id: 'inprogress',
//           label: 'InProgress'
//         },
//         {
//           type: '#',
//           id: 'todo',
//           label: 'ToDo'
//         },
//         {
//           type: '#',
//           id: 'learning',
//           label: 'Learning'
//         },
//         {
//           type: '#',
//           id: 'reading',
//           label: 'reading'
//         }
//       ])
//     })
//   })
// })
