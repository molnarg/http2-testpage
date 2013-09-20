#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var bunyan = require('bunyan');
var spawn   = require('child_process').spawn;
var tls = require('tls');
var http2 = require('http2');

var implementedVersion = 'HTTP-draft-06/2.0';

// Command line parsing
var defaultKey = path.join(__dirname, '../keys/localhost.key');
var defaultCrt = path.join(__dirname, '../keys/localhost.crt');

program
  .version('0.0.0')
  .option('-l, --log [level]', 'Logging level [info]', 'info')
  .option('-k, --key [path]', 'Private key to use [http2-testpage/keys/localhost.key]', defaultKey)
  .option('-c, --crt [path]', 'Certificate to use [http2-testpage/keys/localhost.crt]', defaultCrt)
  .option('-p, --port [port]', 'Port to listen on [8080]', parseInt, 8080)
  .parse(process.argv);

// Initializing logging
var logOutput = process.stdout;
if (process.stdout.isTTY) {
  var bin = path.resolve(path.dirname(require.resolve('bunyan')), '..', 'bin', 'bunyan');
  if(bin && fs.existsSync(bin)) {
    logOutput = spawn(bin, ['-o', 'short'], {
      stdio: [null, process.stdout, process.stderr]
    }).stdin;
  }
}

function createLogger(name) {
  return bunyan.createLogger({
    name: name,
    stream: logOutput,
    serializers: http2.serializers,
    level: program.log
  });
}

var log = createLogger('testpage');

// Importing key and cert
var key = fs.readFileSync(program.key);
var crt = fs.readFileSync(program.crt);

// Creating main server
var server = http2.createServer({ key: key, cert: crt });

// Handling of incoming requests to the main server
var validTestname = /^[a-z0-9\-/]+$/;
server.on('request', function onRequest(req, res) {
  var test = req.url.slice(1);
  var testDir = path.join(__dirname, '../test/', test);

  // Invalid or nonexistent tests
  if (!validTestname.test(test) || !fs.existsSync(testDir)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  var testServer = tls.createServer({
    key: key,
    cert: crt,
    NPNProtocols: [implementedVersion]
  });

  // Allocating port
  var port = undefined;
  while (!port) {
    try {
      port = 1024 + Math.floor(Math.random() * (65535 - 1024));
      testServer.listen(port);
    } catch (e) {
      port = undefined;
    }
  }

  // Redirecting the client to the new test instance
  log.info({ test: test, port: port }, 'Incoming test request; redirecting');
  res.statusCode = 307;
  res.setHeader('Location', 'https://localhost:' + port + '/');
  res.end();

  testServer.on('secureConnection', function(socket) {
    testServer.close();

    if (socket.npnProtocol !== implementedVersion) {
      log.error({ test: test, port: port }, 'Couldn\'t negotiate HTTP/2 with TLS NPN, aborting');
      socket.end();
      return;
    }

    log.info({ test: test, port: port }, 'Starting test');
    var startTest = require(testDir);
    startTest(socket, createLogger(test), evaluateResult);
    setTimeout(evaluateResult.bind(null, 'timeout'), 2000);

    var done = false;
    function evaluateResult(error) {
      if (!done) {
        done = true;
        if (error) {
          log.error({ test: test, port: port, error: error }, 'Error');
        } else {
          log.info({ test: test, port: port }, 'Success');
        }
        socket.destroy();
      }
    }
  });
});

log.info({ port: program.port }, 'Waiting for incoming connections');
server.listen(program.port);
