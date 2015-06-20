module.exports = function (grunt) {
    'use strict';

    var files = [
        '{.,platforms/*}/<%= settings.dir.app + settings.globs.scripts %>',
        '!{.,platforms/*}/<%= settings.dir.app %>/**/*.{generated,mock,spec,e2e}.js',
        '!{.,platforms/*}/<%= settings.dir.app %>/libs/**/*.js'
        ];

    grunt.config.merge({
        jshint: {
            junit: {
                files: {
                    src: files
                },
                options: {
                    force: true,
                    jshintrc: true,
                    reporter: require('jshint-junit-reporter'),
                    reporterOutput: '<%= settings.dir.temp %>/test-reports/jshint/junit.xml'
                }
            },
            html: {
                files: {
                    src: files
                },
                options: {
                    jshintrc: true,
                    reporter: require('jshint-html-reporter'),
                    reporterOutput: '<%= settings.dir.temp %>/test-reports/jshint/index.html'
                }
            },
            console: {
                files: {
                    src: files
                },
                options: {
                    jshintrc: true,
                    reporter: require('jshint-stylish')
                }
            }
        }
    });
};
