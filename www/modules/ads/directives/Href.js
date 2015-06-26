var main = require('../main');

/**
 * Any *[href] element allow for following the URL parameter
 * (makes it easier for working with links in list items)
 * @name ads.directives.href
 * @propertyOf ads.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <div href="#/somewhere"></div>
 */
main.directive('href', function ($location) {

    return {
        restrict: 'A',
        link: function ($scope, $elem) {// jshint ignore:line
            if ($elem[0].tagName !== 'A') {
                $elem.on('click', function (e) {
                    var href = $elem.attr('href');
                    e.preventDefault();
                    e.stopPropagation();
                    $scope.$applyAsync(function () {
                        $location.search({});
                        $location.url(href.charAt(0) === '#' ? href.substr(1) : href);
                    });
                });
            }
        }
    };

});
