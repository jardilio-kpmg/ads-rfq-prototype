var main = require('../main');

/**
 * @class recalls.controllers.CampaignsCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="CampaignsCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('recalls').directive('mydirective', function () {
 *      return {
 *          controller: 'CampaignsCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var campaignsCtrl = controllers[0];
 *              campaignsCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('CampaignsCtrl', function (/**ng.$rootScope.Scope*/ $scope,
                                           /**ng.$routeParams,*/ $routeParams,
                                           /**ng.$location,*/ $location,
                                           /**openfda.services.foodEnforcementService*/ foodEnforcementService,
                                           /**walmartlabs.services.walmartUpcService*/ walmartUpcService) {
                                            ///**factual.services.factualUpcService*/ factualUpcService)

    'use strict';

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'CampaignsCtrl';

    /**
     * @name recalls.controllers.CampaignsCtrl#getName
     * @methodOf recalls.controllers.CampaignsCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    self.recall = null;

    self.product = null;

    self.getRecallData = function (recallId) {

        foodEnforcementService.getRecallById(recallId)
            .success(function (result) {
                if (result.results && result.results.length){
                    self.recall = result.results[0];

                    var upcCode = foodEnforcementService.extractUpc(self.recall);

                    var upcService = walmartUpcService;
                    //var upcService = factualUpcService;
                    upcService.getData(upcCode).success(function(result){
                        var products = upcService.getProducts(result);
                        if (products && products.length) {
                            self.product = products[0];
                        }
                    });
                }
            });
        //TODO: error state for bad input?
    };

    $scope.$watch(
        function () {
            return $routeParams.recallId;
        },
        function (recallId) {
            if (recallId) {
                self.getRecallData(recallId);
            }
        }
    );
});
