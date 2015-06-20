module.exports = function (grunt) {



    grunt.event.on('scaffold.view.prompted', function () {
        grunt.task.run('prompt:scaffoldview');
    });

    grunt.event.on('scaffold.view.executed', function () {
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
            scaffoldview: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.controller',
                            message: function () {
                                return 'Do you want to ' + grunt.config('scaffold.action').cyan + ' a ' + 'controller'.cyan + ' for this view as well?';
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
