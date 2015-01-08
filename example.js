'use strict';

var less = require('less');
less.render('.some { .class { color: black; }}', function (err, output) {
  console.log(output);
});
