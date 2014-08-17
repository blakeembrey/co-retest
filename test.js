/* global describe, it */

var assert  = require('assert');
var retest  = require('./');
var express = require('express');

describe('co-retest(app)', function () {
  it('should be able to make requests', function* () {
    var app = express();

    app.get('/', function (req, res) {
      res.send('hello');
    });

    var res = yield retest(app).get('/');

    assert.equal(res.body, 'hello');
    assert.equal(res.statusCode, 200);
  });

  it('should not fail if reusing the same thunk', function* () {
    var app = express();

    app.get('/', function (req, res) {
      res.send('hello');
    });

    var req = retest(app).get('/');

    // Yield the first request.
    var res1 = yield req;
    var res2 = yield req;
    var res3 = yield req;

    assert.equal(res1.body, 'hello');
    assert.equal(res2.body, 'hello');
    assert.equal(res3.body, 'hello');
    assert.equal(res1.statusCode, 200);
    assert.equal(res2.statusCode, 200);
    assert.equal(res3.statusCode, 200);
  });
});

describe('retest.agent(app)', function () {
  var app = express();

  app.use(require('cookie-parser')());

  app.get('/', function (req, res) {
    res.cookie('cookie', 'hello');
    res.send();
  });

  app.get('/return', function (req, res) {
    res.send(req.cookies.cookie);
  });

  var agent = retest.agent(app);

  it('should save cookies', function* () {
    var res = yield agent.get('/');

    assert.equal(res.headers['set-cookie'], 'cookie=hello; Path=/');
  });

  it('should send cookies', function* () {
    var res = yield agent.get('/return');

    assert.equal(res.body, 'hello');
  });
});
