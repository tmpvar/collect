#!/usr/bin/env node
var
  env = require('jsdom').env,
  argv = require('optimist').argv,
  debug = argv.debug,
  vm = require('vm'),
  regex;

if (argv.match) {
  var parts = argv.match.split('/');
  if (!parts[0]) { parts.shift(); }

  regex = new RegExp(parts[0], parts[1]);
}

debug && console.log(argv)

if (!argv.url) {
  console.log('please pass a --url param');
  process.exit(1);
}

if (argv.selector) {
  env(argv.url, ['http://code.jquery.com/jquery-1.7.2.min.js'], function(errors, window) {
    var $ = window.jQuery;

    var elements = $(argv.selector);
    debug && console.log('found', elements.length, 'elements');

    var ret = [];
    elements.each(function() {
      var element = $(this);
      if (argv.attribute) {
        if (argv.attribute === 'innerHTML') {
          ret.push(element.html());
        } else {
          ret.push(element.attr(argv.attribute));
          ret && console.log(ret);
        }
      } else if (regex) {
        ret = ret.concat(element.html().match(regex));
        debug && console.log('regex:', matches)
      }
    });

    ret.forEach(function(value) {
      if (argv.eval) {
        vm.runInNewContext(argv.eval, { value  : value, console : console }, 'collect evaluator');
      } else {
        console.log(value);
      }
    });
  });
}