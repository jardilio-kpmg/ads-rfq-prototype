var main = require('../main'),
    //what was the history length when we initialized the app?
    initialHistoryLength = window.history.length;

require('./NavBackButton.scss');

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
                $scope.$apply(function () {
                    if (window.history.length > initialHistoryLength) {
                        //if we've added pages to history since init, go back but don't back out of initialization page
                        window.history.back();
                    }
                    else {
                        //if we try to back out of the initialization page, just go home
                        $location.path('/');
                        $location.search({});
                    }
                });
            });
            $elem.addClass('ads nav-back-button');
        }
    };

});
