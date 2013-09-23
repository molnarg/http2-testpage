Version history
===============

### 0.1.0 (2013-09-15) ###

* Organizing tests into subfolders
* Moving connection setup logic into the test runner
* New tests:
  * compression/huge-index
  * compression/invalid-data-1
  * compression/invalid-data-2
  * push/invalid-promised-id-1
  * push/invalid-promised-id-2
  * push/invalid-promised-id-3
  * stream/data-when-closed
  * stream/data-when-idle
  * stream/data-when-reserved-remote
  * stream/priority-when-closed
  * stream/priority-when-idle
  * stream/priority-when-reserved-remote
  * stream/push-promise-when-closed
  * stream/push-promise-when-idle
  * stream/push-promise-when-reserved-remote
  * stream/reservation-when-closed
  * stream/reservation-when-reserved-remote
  * stream/rst-stream-when-closed
  * stream/rst-stream-when-idle
  * stream/window-update-when-closed
  * stream/window-update-when-idle
  * stream/window-update-when-reserved-remote
* [Tarball](https://github.com/molnarg/http2-testpage/archive/http2-testpage-0.2.0.tar.gz)

### 0.1.0 (2013-09-15) ###

* Initial test runner implementation
* Initial set of tests:
  * connection-level-data
  * connection-level-headers
  * connection-level-priority
  * connection-level-push-promise
  * connection-level-rst-stream
  * framing-oversized-data
  * framing-oversized-ping
  * stream-level-goaway
  * stream-level-ping
  * stream-level-settings
* [Tarball](https://github.com/molnarg/http2-testpage/archive/http2-testpage-0.1.0.tar.gz)
