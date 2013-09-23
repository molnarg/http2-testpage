// See ../invalid-frame-when-closed.js

var invalidFrameWhenClosedTest = require('../invalid-frame-when-closed');

module.exports = function(socket, log, callback) {
  invalidFrameWhenClosedTest(socket, log, callback, {
    type: 'WINDOW_UPDATE',
    flags: {},
    window_size: 10
  });
};
