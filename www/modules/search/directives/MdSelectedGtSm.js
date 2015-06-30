var main = require('../main'),
    angular = require('angular');

require('./MdSelectedGtSm.scss');

/**
 * @name search.directives.md-selected-gt-sm
 * @propertyOf search.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <div md-selected-gt-sm></div>
 */
main.directive('mdSelectedGtSm', function () {

    'use strict';

    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: false,
        //optional function or string name of registered controller to link to this directive
        //controller: 'MdSelectedGtSmCtrl',
        //controllerAs: 'mdSelectedGtSm',
        //optional string name to require another directive to exist on target element
        require: ['mdTabs'],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'A',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: null,
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.addClass('search md-selected-gt-sm');
            $scope.$on('$destroy', function () {
                win.off('resize', setSelected);
            });

            var index,
                win = angular.element(window);

            $attr.$observe('mdSelectedGtSm', function (value) {
                index = value;
            });

            function setSelected() {
                if (win.width() >= 600){
                    if (controllers.length) {
                        var tabs = controllers[0];
                        tabs.select(index);
                    }
                }
            }

            win.on('resize', setSelected);
        }
    };

});
