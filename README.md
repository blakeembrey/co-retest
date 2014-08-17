# Co Retest

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]

Simple wrapper for the [retest library](https://github.com/blakeembrey/retest) for co-like interfaces (node.js generators) using thunks.

Currently you must use the `--harmony-generators` flag when running node 0.11.x to get access to generators.

## Installation

```
npm install co-retest --save-dev
```

## Usage

You may pass a `http.Server`, function or string to `retest()` - if the server is not listening for connections it will be bound to an ephemeral port so there is no need to keep track of ports.

```javascript
var co      = require('co');
var retest  = require('co-retest');
var express = require('express');

var app = express();

app.get('/', function (req, res) {
  res.send('hello');
});

co(function* () {
  var res = yield retest(app).get('/');

  console.log('Body: ' + res.body);
  console.log('Status: ' + res.statusCode);
})();
```

All API methods from [retest](https://github.com/blakeembrey/retest) work as usual, but every method returns a thunkified version of request for use with `co`.

**Please note:** The thunkified function return can be called multiple times to get multiple results.

## License

MIT

[npm-image]: https://img.shields.io/npm/v/co-retest.svg?style=flat
[npm-url]: https://npmjs.org/package/co-retest
[travis-image]: https://img.shields.io/travis/blakeembrey/co-retest.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/co-retest
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/co-retest.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/co-retest?branch=master
[gittip-image]: https://img.shields.io/gittip/blakeembrey.svg?style=flat
[gittip-url]: https://www.gittip.com/blakeembrey
