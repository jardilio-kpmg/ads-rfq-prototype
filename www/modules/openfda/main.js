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

openfda.constant('openFdaConfig', {
    apiBase: 'https://api.fda.gov/food/enforcement.json',
    apiKey: 'CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic',
    defaultResultsLimit: 30,
    defaultRecallStatus: 'ongoing',
    defaultProductType: 'food'
});

module.exports = openfda;
