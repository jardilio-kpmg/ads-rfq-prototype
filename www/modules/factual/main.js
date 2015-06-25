var angular = require('angular');

require('./main.scss');

/**
 * @namespace factual
 */

/**
 * @namespace factual.controllers
 */

/**
 * @namespace factual.directives
 */

/**
 * @namespace factual.filters
 */

/**
 * @namespace factual.factories
 */

/**
 * @namespace factual.services
 */

/**
 * @namespace factual.views
 */

/**
 * @module factual
 * @type {angular.Module}
 */
var factual = angular.module('factual', ['ng','ngRoute','kpmgAngular','ngMaterial']);

factual.constant('factualDefaults', {
    server: '//api.v3.factual.com',
    KEY: '6tkrAVLSRY503qIo8SMpiPJCJkdqN4GdIJd99co2',// jshint ignore:line
});

module.exports = factual;
