var main = require('../main');

require('./Campaigns.scss');

/**
 * @name recalls.views.campaigns
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/recalls/campaigns">Campaigns</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/recalls/campaigns/:recallId', {
        controller: 'CampaignsCtrl',
        controllerAs: 'campaigns', 
        template: require('./Campaigns.html'),
        reloadOnSearch: true
    });
});
