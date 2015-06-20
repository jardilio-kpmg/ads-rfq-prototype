/**
 * Rewrites the default connect tasks to make
 * sure that the configProxies is run first
 * and properly setup.
 *
 * DO NOT MODIFY THIS FILE IN YOUR PROJECT! INSTEAD, YOU CAN COPY
 * THE CONFIGURATION DATA AND PLACE THAT INTO YOUR gruntfile.js
 * THEN MODIFY ONLY THE PORTIONS YOU NEED. THIS WILL ALLOW YOUR
 * PROJECT TO BE UPDATED WITH CONFLICT TO NEWER VERSIONS.
 */
module.exports = function (grunt) {

    'use strict';

    grunt.task.renameTask('connect', '_connect');
    grunt.registerTask('connect', function (target) {
        grunt.config('_connect', grunt.config('connect'));
        grunt.task.run([
                'configureProxies:' + target,
                '_connect:' + target
        ]);
    });

};