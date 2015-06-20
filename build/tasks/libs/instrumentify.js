// browserify tranform which wraps istanbulify, filtering out test specs non-JS files

var through = require('through');
var path = require('path');
var istanbulify = require('istanbulify');
var settings = require(__dirname + '/../../../settings.json');

module.exports = function instrumentify(filename) {
    'use strict';

    var testname = filename.split('\\').join('/');

    if(/\.js$/i.test(testname) && !/.spec.|\/libs\/|.mock./i.test(testname)) {
        return istanbulify(filename.toLowerCase());
    } else {
        return through();
    }
};
