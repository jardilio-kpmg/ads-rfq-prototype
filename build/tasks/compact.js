/**
 * Compacts some of the stray files like HTML, JSON and images.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    grunt.config.merge({
        cssmin: {
            compact: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.temp %>/<%= settings.dir.app %>',
                        src: ['**/*.css'],
                        dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>'
                    }
                ]
            }
        },
        useminPrepare: {
            html: ['<%= settings.dir.app %>/*.html'],
            options: {
                dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>'
            }
        },
        usemin: {
            html: ['<%= settings.dir.temp %>/<%= settings.dir.app %>/*.html'],
            options: {
                dirs: ['<%= settings.dir.temp %>/<%= settings.dir.app %>']
            }
        },
        minjson: {
            options: {},
            compact: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.app %>',
                        src: '**/*.json',
                        dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>'
                    }
                ]
            }
        },
        imagemin: {
            options: {},
            compact: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.app %>',
                        src: [
                            '**/*.{png,jpg,jpeg}',
                            '!images/**/sprite*/*.*'
                        ],
                        dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>'
                    }
                ]
            }
        },
        htmlmin: {
            options: {},
            compact: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.app %>',
                        src: ['*.html'],
                        dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>'
                    }
                ]
            }
        },
        uglify: {
            options: {},
            compact: {
                options: {
                    sourceMap: false,
                    compress: true,
                    mangle: true,
                    beautify: false,
                    preserveComments: 'some'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.temp %>/<%= settings.dir.app %>',
                        src: ['**/*.js'],
                        dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>/'
                    }
                ]
            }
        },
        rev: {
            options: {},
            compact: [
                '<%= settings.dir.temp %>/<%= settings.dir.app %>/**/*.js',
                '!<%= settings.dir.temp %>/<%= settings.dir.app %>/modules/preloader/preloader.js',
                '!<%= settings.dir.temp %>/<%= bowerrc.directory %>/*.{js,css}',//see: https://github.com/DaftMonk/generator-angular-fullstack/issues/522
                '<%= settings.dir.temp %>/<%= bowerrc.directory %>/libs.js'//see above, need to reinclude this
            ]
        }
    });

    grunt.registerTask('compact', [
        'useminPrepare',
        'uglify:compact',
        'imagemin:compact',
        'htmlmin:compact',
        'minjson:compact',
        'rev:compact',
        'usemin'
    ]);

};
