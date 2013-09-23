// See ../invalid-frame-when-closed.js

var invalidFrameWhenClosedTest = require('../invalid-frame-when-closed');

module.exports = function(socket, log, callback) {
  invalidFrameWhenClosedTest(socket, log, callback, {
    type: 'DATA',
    flags: {},
    data: new Buffer(10)
  });
};
