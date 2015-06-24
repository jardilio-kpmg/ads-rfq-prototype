var main = require('../main');

require('./ClassificationDistribution.scss');

/**
 * @name recalls.views.classification-distribution
 * @propertyOf recalls.views
 * @ see http://docs.angularjs.org/api/ng.$routeProvider
 * @example {@lang xml}
 * <a href="#/recalls/classification-distribution">ClassificationDistribution</a>;
 */
main.config(function (/**ng.$routeProvider*/ $routeProvider, /**kpmgAngular.services.kRedirectProvider*/ kRedirectProvider) {// jshint ignore:line

    $routeProvider.when('/recalls/classification-distribution', {
        controller: 'ClassificationDistributionCtrl',
        controllerAs: 'classificationDistribution',
        template: require('./ClassificationDistribution.html')
    });

});
