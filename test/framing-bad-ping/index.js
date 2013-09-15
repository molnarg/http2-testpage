var http2 = require('http2');

module.exports = function(socket, log, callback) {
  var endpoint = new http2.Endpoint('SERVER', {}, log);
  socket.pipe(endpoint).pipe(socket);

  setImmediate(function() {
    // After sending the connection header:
    log.debug('Sending oversize PING frame');
    endpoint._serializer.write({
      type: 'PING',
      flags: {},
      stream: 0,
      data: new Buffer(10)
    });
  });

  endpoint.on('peerError', function(error) {
    log.debug('Receiving GOAWAY frame');
    if (error === 'PROTOCOL_ERROR') {
      callback();
    } else {
      callback('Not appropriate error code: ' + error);
    }
  });

  setTimeout(function() {
    callback('Timeout');
  }, 1000);
};
