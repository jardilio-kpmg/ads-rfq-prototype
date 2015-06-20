/**
 * This is the default grunt task that is run that will prompt the user
 * through the steps that may be performaned.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    grunt.file.expand({filter: 'isDirectory', cwd: 'node_modules'}, 'grunt-*').forEach(grunt.loadNpmTasks);

    grunt.config.init({
        settings: grunt.file.readJSON('settings.json'),
        package: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('bower.json'),
        bowerrc: grunt.file.readJSON('.bowerrc'),
        prompt: {
            'default': {
                options: {
                    questions: [
                        {
                            config: 'default.task',
                            type: 'list',
                            message: 'What ' + 'task'.cyan + ' would you like to run?',
                            default: 'scaffold',
                            choices: [
                                {
                                    value: 'scaffold',
                                    name: 'Run the Scaffolding Tools to Build Out Project'
                                },
                                {
                                    value: '<%= settings.servertask || "server" %>',
                                    name: 'Run the Web Application'
                                },
                                {
                                    value: 'cordova',
                                    name: 'Run the Cordova Application'
                                },
                                {
                                    value: 'server:apidesigner',
                                    name: 'Run the API Designer'
                                },
                                {
                                    value: 'test',
                                    name: 'Run the Test Suite'
                                },
                                {
                                    value: 'docs',
                                    name: 'Run the Documentation Generator'
                                },
                                {
                                    value: 'publish',
                                    name: 'Publish the Application for Deployment'
                                }
                            ]
                        },
                        {
                            config: 'default.task',
                            type: 'list',
                            when: function (answers) {
                                return answers['default.task'] === 'server';
                            },
                            message: 'Which ' + 'server'.cyan + ' do you want to run?',
                            default: 'server',
                            choices: [
                                {
                                    value: 'server',
                                    name: 'Development (minimal concatination)'
                                },
                                {
                                    value: 'server:dist',
                                    name: 'Production (concatination and minification)'
                                }
                            ]
                        },
                        {
                            config: 'default.task',
                            type: 'list',
                            when: function (answers) {
                                return answers['default.task'] === 'buildForDotNet';
                            },
                            message: 'Which ' + 'server'.cyan + ' do you want to run?',
                            default: 'buildForDotNet:debug',
                            choices: [
                                {
                                    value: 'buildForDotNet:debug',
                                    name: 'Development (minimal concatination)'
                                },
                                {
                                    value: 'buildForDotNet:release',
                                    name: 'Production (concatination and minification)'
                                }
                            ]
                        },
                        {
                            config: 'default.task',
                            type: 'list',
                            when: function (answers) {
                                return answers['default.task'] === 'test';
                            },
                            message: 'What ' + 'tests'.cyan + ' do you want to run?',
                            default: 'server:test',
                            choices: [
                                {
                                    value: 'server:test',
                                    name: 'Run Unit Tests, Code Coverage and JSHint'
                                },
                                {
                                    value: 'server:e2e',
                                    name: 'Run End-to-End Integration Tests'
                                }
                            ]
                        },
                        {
                            config: 'default.task',
                            type: 'list',
                            when: function (answers) {
                                return answers['default.task'] === 'docs';
                            },
                            message: 'Where do you want to ' + 'publish'.cyan + ' documentation to?',
                            default: 'server:docs',
                            choices: [
                                {
                                    value: 'server:docs',
                                    name: 'Run in Browser (livereload)'
                                },
                                {
                                    value: 'docs',
                                    name: 'Just Export to <%= settings.dir.docs %>'
                                }
                            ]
                        }
                    ],
                    then: function () {
                        grunt.task.run(grunt.config('default.task'));
                    }
                }
            }
        }
    });

    if(grunt.option('dest')) {
        grunt.config.set('settings.dir.temp', grunt.option('dest'));
    }
    grunt.registerTask('default', ['prompt:default']);

};
