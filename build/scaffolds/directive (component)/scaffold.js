module.exports = function (grunt) {



    grunt.event.on('scaffold.directive (component).prompted', function () {
        grunt.task.run('prompt:scaffolddirectivecomponent');
    });

    grunt.event.on('scaffold.directive (component).execute', function (event) {
        var filepath = grunt.config('settings.dir.app') + '/ie8elements.js';
        if (grunt.file.exists(filepath)) {
            var contents = grunt.file.read(filepath, {encoding: 'utf8'}),
                action = grunt.config('scaffold.action'),
                shim = 'document.createElement(\'' + event.context.hyphenCase(grunt.config('scaffold.name')) + '\');';

            switch(action) {
            case 'create':
                if (contents.indexOf(shim) === -1) {
                    contents += '\n' + shim;
                }
                break;
            case 'remove':
                contents = contents.replace(shim, '');
                break;
            }

            grunt.file.write(filepath, contents, {encoding: 'utf8'});
        }
    });

    grunt.event.on('scaffold.directive (component).executed', function () {
        if (grunt.config('scaffold.controller')) {
            var name = grunt.config('scaffold.name').charAt(0).toUpperCase() + grunt.config('scaffold.name').substr(1);
            grunt.task.run('scaffold:' + [
                'controller',
                grunt.config('scaffold.action'),
                grunt.config('scaffold.controller'),
                grunt.config('scaffold.module')
            ].join(','));
        }
    });

    grunt.config.merge({
        prompt: {
            scaffolddirectivecomponent: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.controller',
                            message: function () {
                                return 'Do you want to ' + grunt.config('scaffold.action').cyan + ' a ' + 'controller'.cyan + ' for this directive as well?';
                            },
                            type: 'confirm',
                            default: true
                        },
                        {
                            config: 'scaffold.controller',
                            message: 'What is the ' + 'name'.cyan + ' of the ' + 'controller'.cyan + '?',
                            type: 'input',
                            when: function (answers) {
                                return answers['scaffold.controller'];
                            },
                            default: function () {
                                return grunt.config('scaffold.name').charAt(0).toUpperCase() + grunt.config('scaffold.name').substr(1) + 'Ctrl';
                            }
                        }
                    ]
                }
            }
        }
    });

};
