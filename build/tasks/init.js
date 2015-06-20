

module.exports = function (grunt) {

    'use strict';

    grunt.config.merge({
        prompt: {
            init: {
                options: {
                    questions: [
                        {
                            name: 'package.name',
                            type: 'input',
                            default: '<%= package.name %>',
                            message: 'What ' + 'name'.cyan + ' do you want to give your application?',
                            validate: function (name) {
                                return /^[A-Za-z][A-Za-z0-9-_]*/.test(name) ? true : 'Must be alphanumeric value and begin with alpha character. It may contain - or _ but no spaces.';
                            },
                            when: function () {
                                return grunt.config('package.name').indexOf('webstart') === 0;
                            }
                        },
                        {
                            name: 'settings.styleformat',
                            type: 'list',
                            default: '<%= settings.styleformat %>',
                            message: 'Which ' + 'stylesheet format'.cyan + ' would you like to set as your default?',
                            choices: ['css','less','scss','sass'],
                            when: function () {
                                return !grunt.config('settings.styleformat');
                            }
                        },
                        {
                            name: 'settings.defaultmodule',
                            type: 'input',
                            default: '<%= settings.defaultmodule || package.name %>',
                            message: 'What is the name of the ' + 'default module'.cyan + ' you would like to create?',
                            validate: function (name) {
                                return /^[A-Za-z][A-Za-z0-9-_]*/.test(name) ? true : 'Must be alphanumeric value and begin with alpha character. It may contain - or _ but no spaces.';
                            },
                            when: function () {
                                return !grunt.config('settings.defaultmodule');
                            }
                        },
                        {
                            name: 'settings.cordovaenabled',
                            type: 'confirm',
                            default: false,
                            message: 'Do you require ' + 'cordova'.cyan + ' for your application?',
                            when: function () {
                                return grunt.config('settings.cordovaenabled') === '';
                            }
                        },
                        {
                            name: 'settings.servertask',
                            type: 'list',
                            default: '<%= settings.servertask || "server" %>',
                            message: 'What server ' + 'platform'.cyan + ' do you need for application?',
                            when: function () {
                                return !grunt.config('settings.servertask');
                            },
                            choices: [
                                {
                                    value: 'server',
                                    name: 'Node'
                                },
                                {
                                    value: 'buildForDotNet',
                                    name: '.NET'
                                }
                            ]
                        }
                    ],
                    then: function (answers) {
                        var jsdoc = grunt.file.readJSON('jsdoc.conf.json');
                        jsdoc.templates.systemName = answers['package.name'];

                        grunt.file.write('jsdoc.conf.json', JSON.stringify(jsdoc, null, 2));
                        grunt.file.write('package.json', JSON.stringify(grunt.config('package'), null, 2));
                        grunt.file.write('settings.json', JSON.stringify(grunt.config('settings'), null, 2));

                        var tasks = [];
                        if ('settings.defaultmodule' in answers) {
                            tasks.push('scaffold:.init,create,init,init');
                            tasks.push('scaffold:module,create,' + answers['settings.defaultmodule'] + ',' + answers['settings.defaultmodule']);
                        }
                        if ('settings.cordovaenabled' in answers && answers['settings.cordovaenabled']) {
                            tasks.push('cordova:init');
                        }

                        tasks.push('server');//run the app

                        grunt.task.run(tasks);
                    }
                }
            }
        }
    });

    grunt.registerTask('init', ['prompt:init']);

};
