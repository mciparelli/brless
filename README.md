# brless

less.render() browserify transform

# example

for a main.js:

``` js
var less = require('less');
less.render('.some { .class { color: black; }}', function (err, output) {
  console.log(output);
});
```

first `npm install brless` into your project, then:

## on the command-line

```
$ browserify -t brless main.js > bundle.js
```

now in the bundle output file,

``` js
var less = require('less');
less.render('.some { .class { color: black; }}', function (err, output) {
  console.log(output);
});
```

When you run this code through brless, it turns into:

``` js
process.nextTick(function(){(function (err, output) {
    console.log(output);
})(null,".some .class {\n  color: black;\n}\n")});
```

# install

With [npm](https://npmjs.org) do:

```
npm install brless
```

then use `-t brless` with the browserify command or use `.transform('brless')` from the browserify api.

# TODOs

* write tests
* support promises API

# license

MIT
