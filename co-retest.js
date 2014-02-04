var retest  = require('retest');
var __slice = Array.prototype.slice;

/**
 * Thunkify a request method.
 *
 * @param  {Function} fn
 * @return {Function}
 */
var thunkifyRequest = function (fn) {
  return function () {
    var args    = __slice.call(arguments);
    var context = this;

    return function (done) {
      // Push the callback manually to avoid additional arguments from co.
      args.push(function (err, res) {
        done(err, res);
      });

      return fn.apply(context, args);
    };
  };
};

/**
 * Request methods.
 *
 * @type {Array}
 */
var methods = [
  'get',
  'patch',
  'post',
  'put',
  'head',
  'del'
];

/**
 * Thunkify an instance of request.
 *
 * @param  {Function} fn
 * @return {Function}
 */
var thunkifyRetest = function (fn) {
  return function (app, opts) {
    var request = fn(app, opts);

    // Create the co-retest function.
    var retest = thunkifyRequest(request);
    retest.jar    = request.jar;
    retest.cookie = request.cookie;

    // Wrap regular request methods.
    methods.forEach(function (method) {
      retest[method] = thunkifyRequest(request[method]);
    });

    return retest;
  };
};

/**
 * Create an application request instance.
 *
 * @type {Function}
 */
exports = module.exports = thunkifyRetest(retest);

/**
 * Create a singular agent for continuing cookies between requests.
 *
 * @type {Function}
 */
exports.agent = thunkifyRetest(retest.agent);
