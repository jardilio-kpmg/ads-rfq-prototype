var angular = require('angular');

require('./main.scss');

/**
 * @namespace app
 */

/**
 * @namespace app.controllers
 */

/**
 * @namespace app.directives
 */

/**
 * @namespace app.filters
 */

/**
 * @namespace app.factories
 */

/**
 * @namespace app.services
 */

/**
 * @namespace app.views
 */

/**
 * This is the default application module that will have dependencies on
 * all other modules this application will run. You may have multiple
 * application modules, for instance, you may have a instance for each
 * platform, device or other variant of your application which may be published.
 *
 * This module will add a 'ready' class to the root element when it has
 * initialized and is running. You may use this to flag some state changes
 * in CSS.
 *
 * @module app
 * @type {angular.Module}
 */
var app = angular.module('app', [
    'ng',
    'ngRoute',
    'kpmgAngular',
    'ngMaterial',
    'login'
]);

app.run(function ($rootElement) {
    $rootElement.addClass('app ready');
});

//TODO: register angular module dependencies, run and config functions...

module.exports = app;

//NOTE: scaffolding task for new modules will register here automatically

app.requires.push('ads');