/**
 * This will run end-to-end tests using Protractor and all
 * module e2e spec files against a preconfigured baseUrl
 * that the application is expected to be running on. This
 * task does not start that server for the application, the
 * application can be running anywhere on any accessible
 * domain to be tested, even remote.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    //TODO: what about platforms?

    var path = require('path'),
        protractorBin = path.resolve(grunt.file.exists('node_modules/grunt-protractor-runner/node_modules/protractor/bin/') ?
            'node_modules/grunt-protractor-runner/node_modules/protractor/bin/' :
            'node_modules/protractor/bin/') + path.sep,

        protractorConfig = require('../../protractor.config').config;

    grunt.config.merge({
        protractor_webdriver: {
            options: {
                path: protractorBin
            },
            standalone: {
                options: {
                    command: 'webdriver-manager start --standalone --seleniumPort=' + protractorConfig.seleniumPort,
                    keepAlive: true
                }
            }
        },
        shell: {
            'selenium-update': {
                command: 'node webdriver-manager update --standalone',
                options: {
                    async: false,
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                    execOptions: {
                        cwd: protractorBin
                    }
                }
            }
        },
        protractor: {
            options: {
                configFile: 'protractor.config.js',
                keepAlive: true,
                args: {
                    verbose: true,
                    browser: 'chrome',
                    specs: [
                        '<%= settings.dir.temp %>/<%= settings.dir.app %>/modules/e2e.js'
                    ]
                }
            },
            app: {}//need at least 1 target to run
        }
    });

    var testFiles = grunt.option('tests') ?
        grunt.option('tests').split(',') :
        ['<%= settings.dir.app %>/modules/**<%= settings.globs.e2e %>'];

    grunt.registerTask('e2e', function () {
        grunt.config.merge({
            watch: {
                'e2e': {
                    files: ['<%= settings.dir.app %>/**/*.*'],
                    tasks: ['browserify:e2e','protractor'],
                    options: {
                        spawn: false
                    }
                }
            },
            browserify: {
                'e2e': {
                    src: testFiles,
                    dest: '<%= settings.dir.temp %>/<%= settings.dir.app %>/modules/e2e.js',
                    options: {
                        browserifyOptions: {
                            fullPaths: false,
                            bundleExternal: true,
                            noparse: ['<%= bowerrc.directory %>/**/*.js']
                        }
                    }
                }
            }
        });
        if (grunt.option('baseUrl')) {
            grunt.config('protractor.options.args.baseUrl', grunt.option('baseUrl'));
        }
        if (!grunt.config('protractor.options.args.baseUrl')) {
            //execute tests 1 time by spawning a server with no watch
            grunt.config('server.options.watch', false);
            grunt.task.run('server:e2e');
        }
        else {
            grunt.task.run('shell:selenium-update','protractor_webdriver:standalone','browserify:e2e','protractor');
        }
    });

};
