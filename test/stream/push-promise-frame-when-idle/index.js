// See ../invalid-frame-in-idle.js

var invalidFrameInIdleTest = require('../invalid-frame-in-idle');

module.exports = function(socket, log, callback) {
  invalidFrameInIdleTest(socket, log, callback, {
    type: 'PUSH_PROMISE',
    flags: { },
    promised_stream: 4,
    headers: {
      ':method': 'GET',
      ':scheme': 'https',
      ':host': 'localhost',
      ':path': '/pushed.html'
    }
  });
};
