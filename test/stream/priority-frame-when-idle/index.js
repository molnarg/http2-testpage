// See ../invalid-frame-in-idle.js

var invalidFrameInIdleTest = require('../invalid-frame-in-idle');

module.exports = function(socket, log, callback) {
  invalidFrameInIdleTest(socket, log, callback, {
    type: 'PRIORITY',
    flags: {},
    priority: 10
  });
};
