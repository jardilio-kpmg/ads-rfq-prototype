var main = require('../main');

require('./Index.scss');

/**
 * @name login.views.index
 * @propertyOf login.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/login/">Index</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider) {// jshint ignore:line

    $routeProvider.when('/login/', {
        controller: 'LoginCtrl',
        controllerAs: 'index',
        template: require('./Index.html')
    });

});
