/**
 * Works around issue with spritesmith which may fault if
 * it doesn't find anything to sprite. Also sets all the
 * defaults for sprite config based on the settings file.
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
            sprite: [
                '<%= settings.dir.app %>/**/_*.generated.{png,css,less,scss,sass}'
            ]
        },
        watch: {
            sprite: {
                files: [
                    '<%= settings.dir.app %>/**/*.png',
                    '!<%= settings.dir.app %>/**/_sprites.generated.png'
                ],
                tasks: ['sprite'],
                options: {
                    spawn: false
                }
            }
        }
    });
    grunt.task.renameTask('sprite', '_sprite');
    grunt.registerTask('sprite', function() {
        grunt.task.run('clean:sprite');
        //spritesmith will puke if it doesn't find any matches, so check first before running
        //var spriteFiles = grunt.file.match({filter: 'isFile', cwd: settings.dir.app}, settings.globs.sprites),
        var spriteFiles = grunt.file.expand({filter: 'isFile', cwd: settings.dir.app}, settings.globs.sprites),
            spriteDirs = [],
            spriteDirFiles = {};

        spriteFiles.forEach(function (file) {
            var dir = file.substr(0, Math.max(file.lastIndexOf('/'), file.lastIndexOf('\\')));
            if (!spriteDirFiles[dir]) {
                spriteDirFiles[dir] = [];
                spriteDirs.push(dir);
            }
            spriteDirFiles[dir].push(file);
        });

        if (spriteDirs && spriteDirs.length) {
            var config = {
                _sprite: {},
                watch: {}
            };
            spriteDirs.forEach(function (dir) {
                if (!dir) {
                    return;
                }

                var name = dir.substr(Math.max(dir.lastIndexOf('/'), dir.lastIndexOf('\\')) + 1) || 'sprites',
                    prefix = dir.replace(/(\/|\\)/g, '-'),
                    files = [
                        '<%= settings.dir.app %>/' + dir + '/*.png',
                        '!<%= settings.dir.app %>/' + dir + '/*.generated.png'
                    ];

                var fs = require('fs'),
                    path = require('path'),
                    rev = 0;

                grunt.file.expand(path.resolve(settings.dir.app, dir, '*.png')).forEach(function (file) {
                    rev = Math.max(rev, fs.statSync(file).mtime.getTime());
                });

                config._sprite[dir] = {
                    src: files,
                    dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>/' + dir + '-' + rev + '/' + name + '.generated.png',
                    destCss: '<%= settings.dir.app %>/' + dir + '/_' + name + '.generated.<%= settings.styleformat %>',
                    cssFormat: '<%= settings.styleformat %>',
                    imgPath: (settings.spritebasedir || '') + dir + '-' + rev + '/' + name + '.generated.png',
                    padding: 2,
                    engine: 'pngsmith',
                    algorithm: 'binary-tree',
                    cssSpritesheetName: prefix,
                    cssVarMap: function (sprite) {
                        sprite.name = prefix + '-' + sprite.name.replace(/[^\w_-]/gi, '-');
                    }
                };
            });

            grunt.config.merge(config);

            grunt.task.run('_sprite');
        }
    });

};
