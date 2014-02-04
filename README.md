# co-retest

Simple wrapper for the [retest library](https://github.com/blakeembrey/retest) for co-like interfaces (node.js generators).

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

All API methods from [retest](https://github.com/blakeembrey/retest) work as usual, but every method returns a thunkified version of request for use with co.

## License

MIT
