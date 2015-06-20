/**
 * Installs node and/or bower dependencies in project. If installing
 * bower dependencies, will make sure that the RequireJS
 * config file is in sync.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {
    'use strict';

    grunt.registerTask('install', function(target) {
        var exec = require('child_process').exec,
            fs = require('fs'),
            cb = this.async(),
            npm = 'npm prune && npm install',
            bower = 'node_modules/.bin/bower prune && node_modules/.bin/bower install --force-latest',
            cmd = '';


        if(target ==='auto') {
            target = '';
            if(!grunt.file.exists('www/libs') || fs.statSync('bower.json').mtime >= fs.statSync('www/libs').mtime) {
                grunt.log.writeln('Bower packages may be out of date.  Updating...');
                target += 'bower';
            }
            if(!grunt.file.exists('node_modules') || fs.statSync('package.json').mtime >= fs.statSync('node_modules').mtime) {
                // this doesn't actually do anything when task is running and getting too many false positives
                // grunt.log.writeln('Node packages may be out of date.  Updating...');
                //target += 'node';
            }
            if(target === '') {
                grunt.log.writeln('Bower and NPM packages appear up to date');
                cb();
                return;
            }
        }

        switch(target) {
            case 'node':
                cmd = npm;
                break;
            case 'bower':
                cmd = bower;
                break;
            default:
                cmd = npm + ' && ' + bower;
                break;
        }

        exec(cmd, {cwd: './'}, function(stderr) {
            if (stderr) {
                grunt.log.error(stderr);
            }
            cb();
        });
    });
};
