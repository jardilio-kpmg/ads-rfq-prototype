var main = require('../main');

require('./<%= scaffold.name %>.<%= settings.styleformat %>');

/**
 * @name <%= headlessCamelCase(scaffold.module) %>.directives.<%= hyphenCase(scaffold.name) %>
 * @propertyOf <%= headlessCamelCase(scaffold.module) %>.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <<%= hyphenCase(scaffold.name) %>></<%= hyphenCase(scaffold.name) %>>
 */
main.directive('<%= headlessCamelCase(scaffold.name) %>', function () {

    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: false,<% if (scaffold.controller) { %>
        controller: '<%= camelCase(scaffold.controller) %>',
        controllerAs: '<%= headlessCamelCase(scaffold.name) %>',<% } else { %>
        //optional function or string name of registered controller to link to this directive
        //controller: '<%= camelCase(scaffold.name) %>Ctrl',
        //controllerAs: '<%= headlessCamelCase(scaffold.name) %>', <% } %>
        //optional string name to require another directive to exist on target element
        require: [<%= scaffold.controller ? "'" + headlessCamelCase(scaffold.name) + "'" : "" %>],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'E',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: require('./<%= scaffold.name %>.html'),
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.addClass('<%= hyphenCase(scaffold.module) %> <%= hyphenCase(scaffold.name) %>');
            $scope.$on('$destroy', function () {
                //TODO: clean up work
            });
        }
    };

});
