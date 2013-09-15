var http2 = require('http2');

module.exports = function(socket, log, callback) {
  var endpoint = new http2.Endpoint('SERVER', {}, log);
  socket.pipe(endpoint).pipe(socket);

  endpoint._serializer.write({
    type: 'PING',
    flags: {},
    stream: 0,
    data: new Buffer(10)
  });

  endpoint.on('peerError', function() {
    callback();
  });

  setTimeout(function() {
    callback('Timeout');
  }, 1000);
};
