module.exports = (wallaby) => {
  return {
    files: [
      'src/js/utilities/*.js',
      'src/js/actions/**/*.js',
      'src/js/widgets/**/*.js',
      'src/js/firebase/**/*.js'
    ],
    tests: [
      'test/**/*-spec.js'
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel()
    },
    env: {
      type: "node"
    },
    setup: function(wallaby){
      console.log('Setup');
      console.log('Current worker id: ' + wallaby.workerId);
      console.log('Current session id: ' + wallaby.sessionId);
    },
    teardown: function (wallaby) {
      console.log('Teardown');
      console.log('Current worker id: ' + wallaby.workerId);
      console.log('Current session id: ' + wallaby.sessionId);
    },
    testFramework: 'jasmine',
    debug: true,
    delays: {
      run: 500
    }
  };
};