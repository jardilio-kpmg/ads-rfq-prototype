var main = require('../main');

require('./ClassDistribution.scss');

/**
 * @name recalls.directives.class-distribution
 * @propertyOf recalls.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <class-distribution></class-distribution>
 */
main.directive('classDistribution', function () {

    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: false,
        //optional function or string name of registered controller to link to this directive
        //controller: 'ClassDistributionCtrl',
        //controllerAs: 'classDistribution', 
        //optional string name to require another directive to exist on target element
        require: [],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'E',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: require('./ClassDistribution.html'),
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.addClass('recalls class-distribution');
            $scope.$on('$destroy', function () {
                //TODO: clean up work
            });
        }
    };

});
