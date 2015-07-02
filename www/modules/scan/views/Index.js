var main = require('../main');

require('./Index.scss');

/**
 * @name scan.views.index
 * @propertyOf scan.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/scan">Index</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/scan', {
        controller: 'ScanCtrl',
        controllerAs: 'scan',
        template: require('./Index.html')
    });

});
