#!/usr/bin/env node

var index = process.env.CORDOVA_CMDLINE.indexOf(' --'),
    options = index === -1 ? '' : process.env.CORDOVA_CMDLINE.substr(index),
    platforms = process.env.CORDOVA_PLATFORMS.indexOf(',') === -1 ? ' --platform=' + process.env.CORDOVA_PLATFORMS : '',//only takes one or all platforms for now
    result = require('sync-exec')('grunt cordova:after_prepare' + platforms + options);

console.log(result.stdout);
