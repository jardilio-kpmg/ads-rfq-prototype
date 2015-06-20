module.exports = function (grunt) {



    grunt.event.on('scaffold.service (http).prompted', function () {
        if (grunt.config('scaffold.action') === 'create') {
            grunt.task.run('prompt:scaffoldservicehttp');
        }
    });

    grunt.event.on('scaffold.service (http).execute', function (event) {
        var _ = require('lodash');
        if (grunt.config('scaffold.action') === 'create' && !grunt.config('scaffold.mock')) {
            event.engine.dstFiles = _.filter(event.engine.dstFiles, function (file) {
                return file.indexOf('.mock.js') === -1;
            });
            event.engine.srcFiles = _.filter(event.engine.srcFiles, function (file) {
                return file.indexOf('.mock.js') === -1;
            });
        }
    });

    grunt.config.merge({
        prompt: {
            scaffoldservicehttp: {
                options: {
                    questions: [
                        {
                            config: 'scaffold.mock',
                            message: function () {
                                return 'Do you want to create ' + 'e2e mocks'.cyan + ' for this service as well?';
                            },
                            type: 'confirm',
                            default: false
                        }
                    ]
                }
            }
        }
    });

};
