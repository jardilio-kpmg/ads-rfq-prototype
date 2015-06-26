var angular = require('angular');

require('./main.scss');

/**
 * @namespace openfda
 */

/**
 * @namespace openfda.controllers
 */

/**
 * @namespace openfda.directives
 */

/**
 * @namespace openfda.filters
 */

/**
 * @namespace openfda.factories
 */

/**
 * @namespace openfda.services
 */

/**
 * @namespace openfda.views
 */

/**
 * @module openfda
 * @type {angular.Module}
 */
var openfda = angular.module('openfda', ['ng','ngRoute','kpmgAngular','ngMaterial']);

openfda.constant('openFdaDefaults', {
    server: '//api.fda.gov',
    api_key: 'CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic',// jshint ignore:line
    limit: 100,
    skip: 0,
    status: 'ongoing'
});

module.exports = openfda;
