/**
 * Works around issue with fontsmith which may fault if
 * it doesn't find anything to font. Also sets all the
 * defaults for font config based on the settings file.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    var settings = grunt.config('settings'),
        path = require('path');

    grunt.config.merge({
        clean: {
            font: [
                '<%= settings.dir.app %>/**/_*.generated.{svg,woff,eot,ttf}'
            ]
        },
        watch: {
            font: {
                files: [
                    '<%= settings.dir.app %>/**/*.svg',
                    '!<%= settings.dir.app %>/**/_icons.generated.*'
                ],
                tasks: ['font'],
                options: {
                    spawn: false
                }
            }
        }
    });
    grunt.registerTask('font', function() {
        grunt.task.run('clean:font');

        //fontsmith will puke if it doesn't find any matches, so check first before running
        //var fontFiles = grunt.file.match({filter: 'isFile', cwd: settings.dir.app}, settings.globs.fonts),
        var fontFiles = grunt.file.expand({filter: 'isFile', cwd: settings.dir.app}, settings.globs.fonts),
            fontDirs = [],
            fontDirFiles = {};

        fontFiles.forEach(function (file) {
            var dir = file.substr(0, Math.max(file.lastIndexOf('/'), file.lastIndexOf('\\')));
            if (!fontDirFiles[dir]) {
                fontDirFiles[dir] = [];
                fontDirs.push(dir);
            }
            fontDirFiles[dir].push(file);
        });

        if (fontDirs && fontDirs.length) {
            var config = {
                webfont: {},
                watch: {}
            };
            fontDirs.forEach(function (dir) {
                if (!dir) {
                    return;
                }

                var name = dir.substr(Math.max(dir.lastIndexOf('/'), dir.lastIndexOf('\\')) + 1) || 'icons',
                    prefix = dir.replace(/(\/|\\)/g, '-'),
                    files = [
                        '<%= settings.dir.app %>/' + dir + '/*.svg',
                        '!<%= settings.dir.app %>/' + dir + '/*.generated.svg'
                    ];

                var fs = require('fs'),
                    path = require('path'),
                    rev = 0;

                grunt.file.expand(path.resolve(settings.dir.app, dir, '*.svg')).forEach(function (file) {
                    rev = Math.max(rev, fs.statSync(file).mtime.getTime());
                });

                config.webfont[dir] = {
                    src: files,
                    dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>/' + dir + '-' + rev,
                    destCss: '<%= settings.dir.app %>/' + dir,
                    options: {
                        autoHint: false,
                        hashes: false,//bug hash appearing before extension in stylesheets URLs for fonts
                        stylesheet: '<%= settings.styleformat %>',
                        engine: 'node',
                        relativeFontPath: dir.substr(dir.indexOf(settings.dir.app) + 1) + '-' + rev,
                        font:  name + '.generated',
                        types: 'svg,woff,eot,ttf',
                        syntax: 'bootstrap',
                        templateOptions: {
                            baseClass: prefix,// + '-' + name,
                            classPrefix: prefix + '-',// + name + '-',
                            mixinPrefix: prefix + '-',// + name + '-'
                        }
                    }
                };

                //default is 512 which may not work well with small svn icons, this allows setting per directory by directory name
                var fontHeight = name.match(/([0-9]+)px/);
                if (fontHeight) {
                    config.webfont[dir].options.fontHeight = parseInt(fontHeight[1]);
                }
            });

            grunt.config.merge(config);
            grunt.task.run('webfont');
        }
    });

};
