var main = require('../main');

require('./Index.scss');

/**
 * @name recalls.views.search
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/search">Search</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/search', {
        controller: 'SearchCtrl',
        controllerAs: 'search', 
        template: require('./Index.html'),
        reloadOnSearch: false
    });
});
