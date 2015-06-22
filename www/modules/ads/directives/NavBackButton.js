var main = require('../main'),
    previousUrl = null;

/**
 * @name ads.directives.nav-back-button
 * @propertyOf ads.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <nav-back-button></nav-back-button>
 */
main.directive('navBackButton', function ($location) {

    return {
        restrict: 'E',
        template: require('./NavBackButton.html'),
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            $elem.on('click', function () {
                $scope.$applyAsync(function () {
                    $location.url(previousUrl || '/');
                });
            });
            $elem.addClass('ads nav-back-button');
        }
    };

});

main.run(function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {
        if (oldUrl && oldUrl !== newUrl) {
            previousUrl = oldUrl.substr(oldUrl.indexOf('#') + 1);
        }
    });
});
