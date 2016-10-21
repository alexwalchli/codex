import { default as chai } from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

export { describe, it, beforeEach } from 'mocha'
export { expect } from 'chai'
export { default as sinon } from 'sinon'
