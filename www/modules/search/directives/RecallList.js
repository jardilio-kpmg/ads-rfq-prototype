var main = require('../main');

require('./RecallList.scss');

/**
 * @name search.directives.recall-list
 * @propertyOf search.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <recall-list></recall-list>
 */
main.directive('recallList', function () {

    'use strict';

    return {
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: {
            recalls : '='
        },
        //optional function or string name of registered controller to link to this directive
        //controller: 'RecallListCtrl',
        //controllerAs: 'recallList',
        //optional string name to require another directive to exist on target element
        require: [],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'E',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: require('./RecallList.html'),
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.addClass('search recall-list');
            $scope.$on('$destroy', function () {
                //TODO: clean up work
            });
        }
    };
});
