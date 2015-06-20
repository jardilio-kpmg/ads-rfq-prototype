/**
 * A prompted scaffolding task to build out the
 * project based on templates provided in the build/scaffolds directory.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    var _ = require('lodash')

    function emitEvent(name, data) {
        var proceed = true;
        grunt.event.emit(name, _.extend({
            type: name,
            preventDefault: function () {
                proceed = false;
            }
        }, data));
        return proceed;
    }

    grunt.config.merge({
        scaffold: {
            name: '',
            task: '',
            action: '',
            module: '',
            options: {
                test: 'test',
                engine: './libs/TemplateEngine',
                context: './libs/TemplateContext'
            }
        },
        prompt: {
            scaffold: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.task',
                            type: 'list',
                            message: 'Which scaffolding ' + 'task'.cyan + ' would you like to run?',
                            when: function () {
                                return !grunt.config('scaffold.task');
                            },
                            choices: function () {
                                var _ = require('lodash');
                                return _.compact(_.map(
                                    grunt.file.expand({filter: 'isDirectory'}, 'build/scaffolds/*'),
                                    function (dir) {
                                        var lastIndex = Math.max(dir.lastIndexOf('/'), dir.lastIndexOf('\\')),
                                            name = dir.substr(lastIndex+1);
                                        //hide internal tasks that start with '.'
                                        return name.charAt(0) === '.' ? null : name;
                                    }
                                ));
                            }
                        }
                    ],
                    then: function () {
                        grunt.task.run(['scaffold-prompt']);
                    }
                }
            },
            scaffoldprompt: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.action',
                            type: 'list',
                            message: 'What ' + 'action'.cyan + ' do you want to perform?',
                            default: 'create',
                            when: function () {
                                return !grunt.config('scaffold.action');
                            },
                            choices: [
                                'create',
                                'remove'
                            ]
                        },
                        {
                            config: 'scaffold.name',
                            type: 'input',
                            message: function () {
                                return 'What is the ' + 'name'.cyan + ' of the ' + grunt.config('scaffold.task').cyan + '?';
                            },
                            when: function () {
                                return !grunt.config('scaffold.name');
                            }
                        },
                        {
                            config: 'scaffold.module',
                            type: 'list',
                            message: function () {
                                return 'Which ' + 'module'.cyan + ' should we add the ' + grunt.config('scaffold.task') + ' to?';
                            },
                            'default': '<%= settings.defaultmodule %>',
                            when: function (answers) {
                                var task = answers['scaffold.task'] || grunt.config('scaffold.task');
                                return !grunt.config('scaffold.module') && task !== 'module';
                            },
                            choices: function () {
                                var settings = grunt.config('settings'),
                                    path = require('path'),
                                    modules = grunt.file.expand({filter: 'isDirectory', cwd: path.resolve(settings.dir.app, 'modules')}, '*'),
                                    defaultIndex = modules.indexOf(settings.defaultmodule);

                                if (defaultIndex !== -1) {
                                    modules.splice(defaultIndex, 1);
                                }
                                if (settings.defaultmodule) {
                                    modules.unshift(settings.defaultmodule);
                                }
                                modules.push('New...');
                                return modules;
                            }
                        },
                        {
                            config: 'scaffold.module',
                            type: 'input',
                            message: function () {
                                return 'What is the ' + 'name'.cyan + ' of the ' + 'module'.cyan + ' for the ' + grunt.config('scaffold.task') + '?';
                            },
                            when: function (answers) {
                                return answers['scaffold.module'] === 'New...';
                            }
                        }
                    ],
                    then: function () {
                        emitEvent('scaffold.' + grunt.config('scaffold.task') + '.prompted');
                        grunt.task.run(['scaffold-execute']);
                    }
                }
            }
        }
    });

    grunt.registerTask('scaffold', function (target) {
        var answers = (target || '').split(',');

        //this may have been updated, need to refresh
        grunt.config.merge({
            scaffold: {
                task: answers[0],
                action: answers[1],
                name: answers[2],
                module: answers[3]
            }
        });

        grunt.task.run(['prompt:scaffold']);
    });

    grunt.registerTask('scaffold-prompt', function () {
        var task = grunt.config('scaffold.task'),
            scaffoldfile = 'build/scaffolds/' + task + '/scaffold.js';

        if (grunt.file.exists(scaffoldfile)) {
            require(process.cwd() + '/' + scaffoldfile)(grunt);
        }

        if (emitEvent('scaffold.' + task + '.prompt')) {
            grunt.task.run(['prompt:scaffoldprompt']);
        }
    });

    grunt.registerTask('scaffold-execute', function () {
        var scaffold = grunt.config('scaffold'),
            Context = require(scaffold.options.context),
            Engine = require(scaffold.options.engine),
            context = new Context({
                settings: grunt.config('settings'),
                scaffold: grunt.config('scaffold')
            }),
            engine = new Engine(context, grunt.config('settings.styleformat'));

        var event = 'scaffold.' + grunt.config('scaffold.task') + '.execute',
            data = {
                engine: engine,
                context: context
            };

        if (emitEvent(event, data)) {
            if (engine[scaffold.action]) {
                engine[scaffold.action]();

                var csprojeditor = require('./libs/csprojeditor'),
                    projects = grunt.file.expand('*.csproj');

                switch(scaffold.action) {
                case 'create':
                    projects.forEach(function (csproj) {
                        csprojeditor.addProjectFiles(csproj, engine.dstFiles);
                    });
                    break;
                case 'remove':
                    projects.forEach(function (csproj) {
                        csprojeditor.removeProjectFiles(csproj, engine.dstFiles);
                    });
                    break;
                }
            }
            else {
                grunt.log.warn('The supplied scaffolding engine does not support the action: ' + scaffold.action);
            }
            emitEvent('scaffold.' + grunt.config('scaffold.task') + '.executed');
        }
    });

};
