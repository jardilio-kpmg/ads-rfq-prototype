var main = require('../main');

require('./<%= scaffold.name %>.<%= settings.styleformat %>');
<%
var pathprefix = scaffold.module === settings.defaultmodule ? '' : hyphenCase(scaffold.module) + '/';
var pathsuffix;

switch(scaffold.name.toLowerCase()) {
    case 'index':
    case 'home':
    case 'default':
    pathsuffix = '';
    break;
    default:
    pathsuffix = hyphenCase(scaffold.name);
    break;
    }
%>
/**
 * @name <%= headlessCamelCase(scaffold.module) %>.views.<%= hyphenCase(scaffold.name) %>
 * @propertyOf <%= headlessCamelCase(scaffold.module) %>.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/<%= pathprefix %><%= pathsuffix %>"><%= scaffold.name %></a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/<%= pathprefix %><%= pathsuffix %>', {<% if (scaffold.controller) { %>
        controller: '<%= camelCase(scaffold.controller) %>',
        controllerAs: '<%= headlessCamelCase(scaffold.name) %>', <% } %>
        template: require('./<%= scaffold.name %>.html')//,
        //TODO: you need to determine if this view requires authentication
        //redirectTo: kRedirectProvider.ifNotAuthenticated('/login', true)
    });

});
