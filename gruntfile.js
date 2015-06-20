module.exports = function (grunt) {
    'use strict';

    var timer = require("grunt-timer");
    timer.init(grunt, { deferLogs: true, friendlyTime: true });

    grunt.loadTasks('build/tasks');

    grunt.config.merge({
        //TODO: place your custom grunt config options and overrides here
        profiles: {
            //TODO: register your default base configuration options
            default: {
                //this is the base configuration that specific profiles will merge into
                config: {
                    version: '<%= package.version %>.' + (grunt.option('buildnum') || 'local'),
                    server: 'http://default.domain.com:8080/'
                }
            },
            //TODO: register your profile specific configuration options
            testing: {
                //these settings will merge into default if using the --profile=testing option when running grunt
                config: {
                    server: 'http://testing.domain.com:8080/'
                }
            },
            staging: {
                //these settings will merge into default if using the --profile=staging option when running grunt
                config: {
                    server: 'http://staging.domain.com:8888/'
                }
            },
            production: {
                //these settings will merge into default if using the --profile=production option when running grunt
                config: {
                    server: 'http://production.domain.com/'
                }
            }
        }
    });

    //TODO: place your custom grunt tasks and overrides here

    grunt.registerTask('mytask', function (target) {
        grunt.log.writeln('Running ' + 'mytask'.red + ' with target ' + (target || '[empty]').blue);
    });

};