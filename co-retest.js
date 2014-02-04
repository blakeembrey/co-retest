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
      // Concatinate the callback manually to avoid array arguments from co.
      return fn.apply(context, args.concat(function (err, res) {
        done(err, res);
      }));
    };
  };
};

/**
 * Thunkify a request function.
 *
 * @param  {Function} request
 * @return {Function}
 */
var thunkifyRequest = function (request) {
  var fn = thunkifyRequestMethod(request);

  // Regular request methods that don't need be thunkified.
  fn.jar    = request.jar;
  fn.cookie = request.cookie;

  // Attach all request methods.
  ['get', 'patch', 'post', 'put', 'head', 'del'].forEach(function (method) {
    fn[method] = thunkifyRequestMethod(request[method]);
  });

  return fn;
};

/**
 * Thunkify an instance of request.
 *
 * @param  {Function} fn
 * @return {Function}
 */
var thunkifyRetest = function (fn) {
  return function (app) {
    var request = fn(app);
    var retest  = thunkifyRequest(request);

    /**
     * Export the defaults method and return a thunkified request instance.
     *
     * @return {Function}
     */
    retest.defaults = function () {
      return thunkifyRequest(request.defaults.apply(request, arguments));
    };

    /**
     * Export the forever agent method and return a thunkified request instance.
     *
     * @return {Function}
     */
    retest.forever = function () {
      return thunkifyRequest(request.forever.apply(request, arguments));
    };

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
