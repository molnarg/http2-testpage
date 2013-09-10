HTTP2 testpage
==============

This project aims to provide a server that can be used to test client side HTTP/2 implementations.

One of the most important aspects is handling protocol errors, since it's something that's usually
hard to test without special server side software.

This test server is written in JavaScript for the node.js server-side JavaScript environment using
the [node-http2](https://github.com/molnarg/node-http2) HTTP/2 library.
