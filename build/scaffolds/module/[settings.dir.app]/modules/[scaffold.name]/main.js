var angular = require('angular');

require('./main.<%= settings.styleformat %>');

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.controllers
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.directives
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.filters
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.factories
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.services
 */

/**
 * @namespace <%= headlessCamelCase(scaffold.name) %>.views
 */

/**
 * @module <%= scaffold.name %>
 * @type {angular.Module}
 */
var <%= headlessCamelCase(scaffold.name) %> = angular.module('<%= headlessCamelCase(scaffold.name) %>', ['ng','ngRoute','kpmgAngular','ngMaterial','login']);

//TODO: register angular module dependencies, run and config functions...

module.exports = <%= headlessCamelCase(scaffold.name) %>;
