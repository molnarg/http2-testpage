// See ../invalid-frame-when-reserved-remote.js

var invalidFrameWhenReservedRemoteTest = require('../invalid-frame-when-reserved-remote');

module.exports = function(socket, log, callback) {
  invalidFrameWhenReservedRemoteTest(socket, log, callback, {
    type: 'DATA',
    flags: {},
    data: new Buffer(10)
  });
};
