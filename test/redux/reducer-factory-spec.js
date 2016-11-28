import { reducerFactory } from '../../src/js/redux/reducer-factory'
import { expect } from 'chai'

describe('reducerFactory', () => {
  it('should return a function', () => {
    expect(typeof reducerFactory({}, {})).to.equal('function')
  })

  it('should return state if action is null', () => {
    const state = { a: 1 }
    expect(reducerFactory({}, {})(state, null)).to.deep.equal(state)
  })

  it('should return initial state if state is undefined', () => {
    const state = undefined
    const action = { type: 'init' }
    const initialState = { initial: true }
    expect(reducerFactory(initialState, {})(state, action)).to.deep.equal(initialState)
  })

  it('should return current state if there is no matching action handler', () => {
    const state = { a: 1 }
    const action = { type: 'SOME_ACTION' }
    expect(reducerFactory({}, {})(state, action)).to.equal(state)
  })

  it('should call a matching handler with the state and action', () => {
    const state = { a: 1 }
    const action = { type: 'ADD_ONE' }
    const actionHandlerMapping = {
      'ADD_ONE': (state, action) => {
        return Object.assign({}, state, {
          a: 2
        })
      }
    }

    const newState = reducerFactory({}, actionHandlerMapping)(state, action)

    expect(newState.a).to.equal(2)
  })
})
