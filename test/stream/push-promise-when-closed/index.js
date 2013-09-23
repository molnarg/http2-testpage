// See ../invalid-frame-when-closed.js

var invalidFrameWhenClosedTest = require('../invalid-frame-when-closed');

module.exports = function(socket, log, callback) {
  invalidFrameWhenClosedTest(socket, log, callback, {
    type: 'PUSH_PROMISE',
    flags: {},
    promised_stream: 4,
    headers: {
      ':method': 'GET',
      ':scheme': 'https',
      ':host': 'localhost',
      ':path': '/pushed.html'
    }
  });
};
