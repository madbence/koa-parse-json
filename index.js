var concat = require('co-concat-stream');

module.exports = function(opts) {
  opts = opts || {};
  opts.limit = opts.limit || 2<<20; // 1MB
  return function*(next) {
    var length = this.req.headers['content-length'];
    if(length > opts.limit) {
      this.throw(413);
    }
    var body = yield* concat(this.req, opts);
    if (!body) {
      this.request.body = null;
    } else if(length) {
      if(body.length < length) {
        this.throw(400, 'Content-Length mismatch!')
      } else if(body.length > length) {
        this.throw(413, 'Content-Length mismatch!')
      }
      this.request.body = JSON.parse(body);
    }
    yield* next;
  }
};
