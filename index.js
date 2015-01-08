'use strict';

var staticModule = require('static-module');
var quote = require('quote-stream');
var through = require('through2');
var less = require('less');
var path = require('path');
var stream = require('stream');

var stringStream = function (contents) {
  var rs = new stream.Readable();
  rs._read = function noop() {};
  rs.push(contents);
  rs.push(null);
  return rs;
};

var lessStream = function(opts) {
  var fileContents = '';

  var write = function (buf, enc, next) {
    fileContents += buf.toString();
    next();
  };
  var end = function (done) {
    var stream = this;
    less.render(fileContents, opts).then(function (output) {
      stream.push(output.css);
      stream.push(null);
      done();
    }).catch(function (err) {
      stream.emit('error', new Error(err.message + ': ' + err.filename + '(' + err.line + ')'));
    });
  };
  return through(write, end);
};

var wrapperStream = function (cb) {
  var startStr = 'process.nextTick(function(){' +
    '(' + cb + ')(null,';
  var endStr = ')})';

  var end = function (done) {
    this.push(endStr);
    this.push(null);
    done();
  };
  var write = function (buf, enc, next) {
    this.push(buf);
    next();
  };

  var stream = through(write, end);
  stream.push(startStr);
  return stream;
};


module.exports = function (file) {
  var render = function (contents, opts, cb) {
    if (typeof opts === 'function') {
      cb = opts;
      opts = null;
    }
    var stringS = stringStream(contents);
    var wrapperS = wrapperStream(cb);
    var lessS = lessStream(opts);
    lessS.on('error', function (err) { sm.emit('error', err); });
    return stringS.pipe(lessS).pipe(quote()).pipe(wrapperS);
  };

  var sm = staticModule({
    less: {
      render: render
    }
  }, {
    vars: {
      __dirname: path.dirname(file),
    }
  });

  return sm;
};
