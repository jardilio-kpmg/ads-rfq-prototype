var main = require('../main');

require('./Search.scss');

/**
 * @name recalls.views.search
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/recalls/search">Search</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/recalls/search', {
        controller: 'SearchCtrl',
        controllerAs: 'search', 
        template: require('./Search.html')
    });

});
