#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs');
var http = require('http');
var bunyan = require('bunyan');

var defaultKey = path.join(__dirname, '../keys/localhost.key');
var defaultCrt = path.join(__dirname, '../keys/localhost.crt');

program
  .version('0.0.0')
  .option('-l, --log [level]', 'Logging level [info]', 'info')
  .option('-k, --key [path]', 'Private key to use [http2-testpage/keys/localhost.key]', defaultKey)
  .option('-c, --crt [path]', 'Certificate to use [http2-testpage/keys/localhost.crt]', defaultCrt)
  .option('-p, --port [port]', 'Port to listen on [8080]', parseInt, 8080)
  .parse(process.argv);

var server = http.createServer(onRequest);
server.listen(program.port);

var log = bunyan.createLogger({
  name: 'testpage',
  level: program.log
});

var key = fs.readFileSync(program.key);
var crt = fs.readFileSync(program.crt);

var validTestname = /^[a-z\-]+$/;

function onRequest(req, res) {
  var test = req.url.slice(1);
  var testDir = path.join(__dirname, '../test/', test);

  // Invalid or nonexistent tests
  if (!validTestname.test(test) || !fs.existsSync(testDir)) {
    res.statusCode = 404;
    res.end();
    return;
  }

  log.info({ test: test }, 'Incoming test request, creating test instance');

  // Creating the test server
  var createTestServer = require(testDir);
  var instance = createTestServer({
    key: key,
    cert: crt,
    log: bunyan.createLogger({
      name: test,
      level: program.log
    })
  });

  // Allocating port
  var port = undefined;
  while (!port) {
    try {
      port = 1024 + Math.floor(Math.random() * (65535 - 1024));
      instance.listen(port);
    } catch (e) {
      port = undefined;
    }
  }

  // Redirecting the client to the new test instance
  log.info({ test: test, port: port }, 'Redirecting to the newly created test instance');
  res.statusCode = 307;
  res.setHeader('location', 'https://localhost:' + port + '/');
  res.end();
}
