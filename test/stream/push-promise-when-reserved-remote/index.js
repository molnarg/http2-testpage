// See ../invalid-frame-when-reserved-remote.js

var invalidFrameWhenReservedRemoteTest = require('../invalid-frame-when-reserved-remote');

module.exports = function(socket, log, callback) {
  invalidFrameWhenReservedRemoteTest(socket, log, callback, {
    type: 'PUSH_PROMISE',
    flags: {},
    promised_stream: 10,
    headers: {
      ':method': 'GET',
      ':scheme': 'https',
      ':host': 'localhost',
      ':path': 'promised-resource-2'
    }
  });
};
