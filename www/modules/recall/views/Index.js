var main = require('../main');

require('./Index.scss');

/**
 * @name recall.views.campaigns
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/recall/123">Campaigns</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/recall/:recallId', {
        controller: 'RecallCtrl',
        controllerAs: 'recall',
        template: require('./Index.html'),
        reloadOnSearch: true
    });
});
