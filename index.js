var concat = require('co-concat-stream');

module.exports = function(opts) {
  opts = opts || {};
  opts.limit = opts.limit || 2<<20; // 1MB
  return function*(next) {
    var body = yield* concat(this.req, opts);
    this.request.body = JSON.parse(body);
    yield* next;
  }
};
