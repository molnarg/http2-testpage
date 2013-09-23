// > [5.1. Stream States](http://tools.ietf.org/html/draft-ietf-httpbis-http2-06#section-5.1)
// >
// > ...
// >
// > A stream in the **reserved (remote)** state has been reserved by a remote peer.
// >
// > * Either endpoint can send a RST_STREAM frame to cause the stream to become "closed". This
// >   releases the stream reservation.
// >
// > * Receiving a HEADERS frame causes the stream to transition to "half closed (local)".
// >
// > * An endpoint MAY send PRIORITY frames in this state to reprioritize the stream.
// >
// > Receiving any other type of frame MUST be treated as a stream error of type PROTOCOL_ERROR.
// >
// > ...
// >
// > In the absence of more specific guidance elsewhere in this document, implementations SHOULD
// > treat the receipt of a message that is not expressly permitted in the description of a state
// > as a connection error (Section 5.4.1) of type PROTOCOL_ERROR.

var http2 = require('http2');

module.exports = function(socket, log, callback, invalidFrame) {
  var endpoint = new http2.Endpoint(log, 'SERVER', {}, { beforeCompression: beforeCompression });
  socket.pipe(endpoint).pipe(socket);

  endpoint.on('stream', function(stream) {
    stream.headers({
      ':status': 200
    });
    stream.promise({
      ':method': 'GET',
      ':scheme': 'https',
      ':host': 'localhost',
      ':path': 'promised-resource'
    });
  });

  function beforeCompression(frame, forward, done) {
    forward(frame);
    if (frame.type === 'PUSH_PROMISE') {
      invalidFrame.stream = frame.promised_stream;
      forward(invalidFrame);
    }
    done();
  }

  endpoint.on('peerError', function(error) {
    if (error === 'PROTOCOL_ERROR') {
      callback();
    } else {
      callback('Not appropriate error code: ' + error);
    }
  });
};
