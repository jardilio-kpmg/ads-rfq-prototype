var angular = require('angular');

require('./main.scss');

/**
 * @namespace walmartlabs
 */

/**
 * @namespace walmartlabs.controllers
 */

/**
 * @namespace walmartlabs.directives
 */

/**
 * @namespace walmartlabs.filters
 */

/**
 * @namespace walmartlabs.factories
 */

/**
 * @namespace walmartlabs.services
 */

/**
 * @namespace walmartlabs.views
 */

/**
 * @module walmartlabs
 * @type {angular.Module}
 */
var walmartlabs = angular.module('walmartlabs', ['ng','ngRoute','kpmgAngular','ngMaterial']);

walmartlabs.constant('walmartlabsDefaults', {
    server: '//api.walmartlabs.com',
    apiKey: 'hcmmsqz3fcsaj9habtsqet5y',// jshint ignore:line
});

module.exports = walmartlabs;
