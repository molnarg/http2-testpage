HTTP2 testpage
==============

This project aims to provide a server that can be used to test client side HTTP/2 implementations.

One of the most important aspects is handling protocol errors, since it's something that's usually
hard to test without custom server side software.

The test server is written in JavaScript for [node.js](http://nodejs.org/) using the
[node-http2](https://github.com/molnarg/node-http2) HTTP/2 library.

Supported client software
-------------------------

The goal is to be accessible to as many different clients as possible. Currently, you will need a
client software with the following capabilities:

* ability to follow redirects (307 Temporary Redirect)

This list will probably gain more items in the future. For example, tests will need a way to tell
client software what to do next. The simplest solution is to send HTML code that contains links to
images or iframes. This will require the client to be able to parse HTML and initiate requests for
subresources.

The only supported version of the standard is the
[draft-ietf-httpbis-http2-06](http://tools.ietf.org/html/draft-ietf-httpbis-http2-06) draft.

How to use
----------

You will need at least node version 0.10.0. Clone from git, and then install dependencies:

```bash
$ git clone https://github.com/molnarg/http2-testpage.git
$ cd http2-testpage
$ npm install
```

Start the server:

```bash
$ ./bin/http2-testpage.js
```

Point your client software to the `https://localhost:8080/testname` URL, where `testname` is one of
the directory names in the `test` directory. It will create a server on a dedicated port and
redirect the client to that port using a 307 Temporary Redirect.
