var main = require('../main');

/**
 * @name kpmg.directives.format
 * @propertyOf kpmg.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <div format></div>
 */
main.directive('format', function (
    /**ng.$filter*/ $filter) {

    'use strict';

    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: false,
        //optional function or string name of registered controller to link to this directive
        //controller: 'FormatCtrl',
        //controllerAs: 'format',
        //optional string name to require another directive to exist on target element
        require: ['ngModel'],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'A',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: null,
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            var filter, options;

            $attr.$observe('format', function (value) {
                filter = value;
            });

            $attr.$observe('formatOptions', function (value) {
                options = value;
            });

            if (controllers.length){
                controllers[0].$formatters.push(function(data) {
                    //convert data from model format to view format
                    return $filter(filter).apply(null, [data].concat(options)); //converted
                });
            }
        }
    };

});
