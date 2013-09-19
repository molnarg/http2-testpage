// [From the spec](http://tools.ietf.org/html/draft-ietf-httpbis-http2-06#section-4.2):
//
//    4.2. Frame Size
//
//    The maximum size of a frame payload varies by frame type and use.
//    For instance, the HTTP/2.0 usage limits frames to 2^16-1 (16,383)
//    octets (Section 9.3).  All implementations SHOULD be capable of
//    receiving and minimally processing frames up to the maximum size.
//
//    Certain frame types, such as PING (see Section 6.7), impose
//    additional limits on the amount of payload data allowed.  Likewise,
//    additional size limits can be set by specific application uses (see
//    Section 9).
//
//    If a frame size exceeds any defined limit, or is too small to contain
//    mandatory frame data, the endpoint MUST send a FRAME_TOO_LARGE error.
//    Frame size errors in frames that affect connection-level state MUST
//    be treated as a connection error (Section 5.4.1).

var http2 = require('http2');

var MAX_HTTP_PAYLOAD_SIZE = 16383;

module.exports = function(socket, log, callback) {
  var endpoint = new http2.Endpoint(log, 'SERVER', {});
  socket.pipe(endpoint).pipe(socket);

  endpoint.on('stream', function(stream) {
    endpoint._compressor.write({
      type: 'HEADERS',
      flags: {},
      stream: stream.id,
      headers: {
        ':status': 200
      }
    });

    log.debug('Sending oversized DATA frame');

    endpoint._serializer._sizeLimit = Infinity;
    endpoint._serializer.write({
      type: 'DATA',
      flags: {},
      stream: stream.id,
      data: new Buffer(MAX_HTTP_PAYLOAD_SIZE + 10)
    });
  });

  endpoint.on('peerError', function(error) {
    clearTimeout(timeout);
    log.debug('Receiving GOAWAY frame');
    if (error === 'FRAME_TOO_LARGE') {
      callback();
    } else {
      callback('Not appropriate error code: ' + error);
    }
  });

  var timeout = setTimeout(function() {
    endpoint.close();
    callback('Timeout');
  }, 1000);
};
