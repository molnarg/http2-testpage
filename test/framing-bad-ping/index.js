var http2 = require('http2');

module.exports = function(options) {
  var server = http2.createServer(options, function(req, res) {
    res.end('Hello World!\n');
  });

  return server;
};
