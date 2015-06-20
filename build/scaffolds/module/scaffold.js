module.exports = function (grunt) {

    grunt.event.on('scaffold.module.prompted', function () {
        grunt.task.run('prompt:scaffoldmodule');
    });

    grunt.event.on('scaffold.module.executed', function () {
        if (grunt.config('scaffold.view')) {
            grunt.task.run('scaffold:' + [
                'view',
                grunt.config('scaffold.action'),
                grunt.config('scaffold.view'),
                grunt.config('scaffold.name')
            ].join(','));
        }

        var Context = require('../../tasks/libs/TemplateContext'),
            context = new Context(),
            moduleName = grunt.config('scaffold.name'),
            appFile = 'www/modules/app/main.js',
            contents = grunt.file.read(appFile);

        contents += '\napp.requires.push(\'' + context.headlessCamelCase(moduleName) + '\');';
        grunt.file.write(appFile, contents);
        grunt.log.warn('A reference to this module has been added to the "app" module. You may modify this if you need.'.yellow);
    });

    grunt.config.merge({
        prompt: {
            scaffoldmodule: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.view',
                            message: function () {
                                return 'Do you want to ' + grunt.config('scaffold.action').cyan + ' a ' + 'view'.cyan + ' for this module';
                            },
                            type: 'confirm',
                            default: true
                        },
                        {
                            config: 'scaffold.view',
                            message: 'What is the ' + 'name'.cyan + ' of the ' + 'view'.cyan + '?',
                            type: 'input',
                            when: function (answers) {
                                return answers['scaffold.view'];
                            },
                            default: 'Index'
                        }
                    ]
                }
            }
        }
    });

};
