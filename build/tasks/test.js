/**
 * Performs unit tests on project from a command line and
 * outputs results to screen and junit xml files.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {
    'use strict';

    var htmlCoverageReporter = {
            dir: 'test-reports',
            reporters: [
                {
                    type: 'html',
                    subdir: function() { return 'coverage'; }
                },
                {
                    type: 'cobertura',
                    file: 'coverage.cobertura.xml',
                    subdir: function() { return 'coverage'; }
                },
                {
                    type: 'clover',
                    file: 'coverage.clover.xml',
                    subdir: function() { return 'coverage'; }
                }
            ]
        },
        textCoverageReporter = {
            type: 'text',
            dir: 'test-reports',
            subdir: function() { return 'coverage'; }
        };


    grunt.config.merge({
        clean: {
            test: ['<%= settings.dir.temp %>/test','<%= settings.dir.temp %>/test-reports']
        },
        copy: {
            test: {
                files: [
                    {
                        src: __dirname + '/test.html',
                        dest: '<%= settings.dir.temp %>/test-reports/index.html'
                    },
                    {
                        src: __dirname + '/testinprogress.html',
                        dest: '<%= settings.dir.temp %>/test-reports/results/index.html'
                    },
                    {
                        src: __dirname + '/testinprogress.html',
                        dest: '<%= settings.dir.temp %>/test-reports/coverage/index.html'
                    }
                ]
            }
        },
        shell: {
            'karma-phantom-server': {
                command: 'grunt karma:phantom-server --force --dest=' + grunt.config('settings.dir.temp'),
                options: {
                    async: true,
                    stdout: true,
                    stderr: true,
                    failOnError: false
                }
            }
        },
        karma: {
            options: {
                basePath: '<%= settings.dir.temp %>',
                files: [
                    'test/<%= bowerrc.directory %>/libs.js',
                    '../node_modules/jasmine-jquery/lib/jasmine-jquery.js',
                    'test/<%= settings.dir.app %>/modules/preloader.js',//must load first
                    'test/<%= settings.dir.app %>/modules/*.js',
                    'test/platforms/*/<%= bowerrc.directory %>/libs.js',
                    'test/platforms/*/<%= settings.dir.app %>/modules/preloader.js',//must load first
                    'test/platforms/*/<%= settings.dir.app %>/modules/*.js',
                    // Localization strings need to be available for on-demand loading
                    {
                        pattern: 'test/<%= settings.dir.app %>/locales/*/*.json',
                        included: false,
                        served: true
                    }
                ],
                browserNoActivityTimeout: 60000, // Fix for "Disconnected (1 times)" errors
                browsers: ['PhantomJS'],
                frameworks: ['jasmine'],
                port: 9010,
                colors: true,
                logLevel: 'INFO',
                singleRun: true,
                // PhantomJS issue resolving localhost very slow on windows
                hostname: '127.0.0.1',
                // Karma serves places files under '/base' by default and our content is under settings.dir.app
                urlRoot: '/base/test/<%= settings.dir.app %>/',
                junitReporter: {
                    outputFile: 'test-reports/results/junit.xml'
                },
                htmlReporter: {
                    outputDir: '<%= settings.dir.temp %>/test-reports',
                    middlePathDir : 'results',
                    templatePath: __dirname+'/jasmine_template.html'
                }
            },
            'phantom-console': {
                reporters: ['progress', 'coverage', 'junit'],
                coverageReporter: textCoverageReporter
            },
            'phantom-html': {
                reporters: ['progress', 'coverage', 'html', 'junit'],
                coverageReporter: htmlCoverageReporter
            },
            'phantom-server': {
                singleRun: false,
                autoWatch: true,
                reporters: ['progress', 'coverage', 'html', 'junit'],
                coverageReporter: htmlCoverageReporter
            }

            // TODO: another config which uses real browsers.
            // what's the best way to show these results in a browser?
            // generate an index page that summarizes and links to the
            // results from each browser?  not clear how to achieve that
        }
    });

    grunt.registerTask('test', function (target) {
        target = target || 'console';

        var karmaTask = (target == 'server' ? 'shell:karma-phantom-' : 'karma:phantom-') + target;

        grunt.config.merge({
            watch: {
                test: {
                    files: [
                        '{.,platforms/*}/<%= settings.dir.app %>/modules/**/*.js'
                    ],
                    tasks: ['jshint'],
                    options: {
                        spawn: false
                    }
                }
            },
            build: {
                options: {
                    specs: true,
                    temp: '<%= settings.dir.temp %>/test'
                }
            }
        });

        grunt.task.run([
            'clean:test',
            'build',//build all platforms
            'copy:test',
            'jshint:junit',
            'jshint:' + (target === 'console' ? 'console' : 'html'),
            karmaTask
        ]);
    });

};
