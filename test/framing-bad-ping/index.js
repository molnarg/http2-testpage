var http2 = require('http2');

module.exports = function(options) {
  var server = http2.createServer(options);

  server.on('request', function(req, res) {
    res.end('Hello World!\n');
  });

  server.on('connection', function(socket, endpoint) {
    endpoint._serializer.write({
      type: 'PING',
      flags: {},
      stream: 0,
      data: new Buffer(10)
    });
  });

  return server;
};
