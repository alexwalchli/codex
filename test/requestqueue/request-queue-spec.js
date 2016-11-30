import { enqueue } from '../../src/js/requestqueue/request-queue'
import { expect } from 'chai'
import sinon from 'sinon'
describe('requestQueue', () => {
  it('should execute the request if there are no pending requests', (done) => {
    const funcResponse = { response: true }
    const func = () => {
      return Promise.resolve(funcResponse)
    }

    enqueue(func).then((resp) => {
      expect(resp).to.equal(funcResponse)
      done()
    })
  })
  it('should execute all requests in order with the right arguments', (done) => {
    const funcResponse1 = { request: 1 }
    const funcResponse2 = { request: 2 }
    const funcResponse3 = { request: 3 }
    const request1Args = [1]
    const request2Args = [2]
    const request3Args = [3]
    const request = sinon.stub()
    request.onCall(0).returns(new Promise((resolve, reject) => {
      setTimeout(() => { resolve(funcResponse1) }, 3)
    }))
    request.onCall(1).returns(new Promise((resolve, reject) => {
      setTimeout(() => { resolve(funcResponse2) }, 2)
    }))
    request.onCall(2).returns(new Promise((resolve, reject) => {
      setTimeout(() => { resolve(funcResponse3) }, 0)
    }))

    const p1 = enqueue(request, request1Args)
    const p2 = enqueue(request, request2Args)
    const p3 = enqueue(request, request3Args)

    p1.then(resp => {
      expect(resp).to.equal(funcResponse1)
      p2.then(resp => {
        expect(resp).to.equal(funcResponse2)
        p3.then(resp => {
          expect(resp).to.equal(funcResponse3)
          expect(request.firstCall.args).to.deep.equal(request1Args)
          expect(request.secondCall.args).to.deep.equal(request2Args)
          expect(request.thirdCall.args).to.deep.equal(request3Args)
          done()
        })
      })
    })
  })
})
