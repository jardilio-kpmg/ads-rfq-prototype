var main = require('../main');

require('./ClassificationIcon.scss');

/**
 * @name ads.directives.classification-icon
 * @propertyOf ads.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <classification-icon></classification-icon>
 */
main.directive('classificationIcon', function () {

    return {
        scope: {
            classification: '@'
        },
        restrict: 'E',
        template: require('./ClassificationIcon.html'),
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.addClass('recall classification-icon');
            $scope.$on('$destroy', function () {
                //TODO: clean up work
            });
        }
    };

});
