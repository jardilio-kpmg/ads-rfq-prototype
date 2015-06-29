var main = require('../main');

require('./Index.scss');

/**
 * @name recalls.views.index
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/scan">Index</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/scan', {
        template: require('./Index.html')
    });

});
