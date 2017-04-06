module.exports = (wallaby) => {
  return {
    files: [
      { pattern: 'node_modules/chai/lib/chai.js', instrument: false },
      { pattern: 'node_modules/sinon/lib/sinon.js', instrument: false },
      { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },
      { pattern: 'test/common.js', load: false, instrument: false },
      { pattern: 'src/js/utilities/*.js', load: false },
      { pattern: 'src/js/actions/**/*.js', load: false },
      { pattern: 'src/js/reducers/**/*.js', load: false },
      { pattern: 'src/js/widgets/**/*.js', load: false },
      { pattern: 'src/js/firebase/**/*.js', load: false }
    ],
    tests: [
      'test/**/*-spec.js'
    ],
    testFramework: 'mocha',
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    env: {
      type: 'node'
    },
    setup: function (wallaby) {
      console.log('Setup')
      console.log('Current worker id: ' + wallaby.workerId)
      console.log('Current session id: ' + wallaby.sessionId)
    },
    teardown: function (wallaby) {
      console.log('Teardown')
      console.log('Current worker id: ' + wallaby.workerId)
      console.log('Current session id: ' + wallaby.sessionId)
    },
    debug: true,
    delays: {
      run: 1000
    }
  }
}
