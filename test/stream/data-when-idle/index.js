// See ../invalid-frame-when-idle.js

var invalidFrameWhenIdleTest = require('../invalid-frame-when-idle');

module.exports = function(socket, log, callback) {
  invalidFrameWhenIdleTest(socket, log, callback, {
    type: 'DATA',
    flags: {},
    data: new Buffer(10)
  });
};
