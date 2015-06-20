/**
 * Runs a build and exports all the generated and static files to
 * the dist folder defined in settings.json. The contents of the
 * dist folder will then be archived as *.zip and *.war where
 * * is the name of the project defined in package.json.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    grunt.config.merge({
        clean: {
            publish: ['<%= settings.dir.dist %>']
        },
        copy: {
            publish: {
                files: [
                    {
                        cwd: '<%= settings.dir.app %>',
                        expand: true,
                        src: [
                            '**/*',
                            '**/.htaccess',
                            '!**/.gitignore',
                            '!**/.svn/*',
                            '!**/.DS_Store',
                            '!modules/**/*.js',
                            '!**/*.{scss,less,sass}'
                        ],
                        dest: '<%= settings.dir.dist %>/'
                    },
                    {
                        cwd: '<%= settings.dir.temp %>/<%= settings.dir.app %>',
                        expand: true,
                        src: [
                            '**/*',
                            '**/.htaccess',
                            '!**/.gitignore',
                            '!**/.svn/*',
                            '!**/.DS_Store'
                        ],
                        dest: '<%= settings.dir.dist %>/'
                    }
                ]
            },
            'publish-war': {
                src: '<%= settings.dir.dist %>/<%= package.name %>.zip',
                dest: '<%= settings.dir.dist %>/<%= package.name %>.war'
            }
        },
        compress: {
            publish: {
                options: {
                    archive: '<%= settings.dir.dist %>/<%= package.name %>.zip',
                    mode: 'zip'
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.dir.dist %>',
                        src: [
                            '**/.htaccess',
                            '**/*',
                            '!<%= package.name %>.zip'
                        ]
                    }
                ]
            }
        }
    });

    grunt.registerTask('publish', function () {
        grunt.config.merge({
            build: {
                options: {
                    dist: true,
                    specs: false
                }
            }
        });
        grunt.task.run([
            'clean:publish',
            'build:www',
            'copy:publish',
            'compress:publish',
            'copy:publish-war'
        ]);
    });

};