var retest  = require('retest');
var __slice = Array.prototype.slice;

/**
 * Thunkify a request method.
 *
 * @param  {Function} fn
 * @return {Function}
 */
var thunkifyRequestMethod = function (fn) {
  return function () {
    var args    = __slice.call(arguments);
    var context = this;

    return function (done) {
      // Concatinate the callback with the original arguments.
      return fn.apply(context, args.concat(function (err, res) {
        done(err, res);
      }));
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
    var retest = thunkifyRequestMethod(request);
    retest.jar    = request.jar;
    retest.cookie = request.cookie;

    // Wrap regular request methods.
    methods.forEach(function (method) {
      retest[method] = thunkifyRequestMethod(request[method]);
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
