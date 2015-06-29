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
main.controller('RecallCtrl', function (/**ng.$rootScope.Scope*/ $scope,
                                           /**ng.$routeParams,*/ $routeParams,
                                           /**ng.$location,*/ $location,
                                           /**openfda.services.foodEnforcementService*/ foodEnforcementService,
                                           /**factual.services.factualUpcService*/ factualUpcService) {

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

        /**
         * Recall
         * @type {null}
         */
        self.recall = null;

        /**
         * Product from upc service
         * @type {null}
         */
        self.product = null;

        /**
         * States
         * @type {{LOADING: number, RESULT: number}}
         */
        self.states = {
            NORMAL: 0,
            LOADING: 1,
            RESULT: 2
        };

        /**
         * State
         * @type {number}
         */
        self.state = self.states.NORMAL;

        /**
         * Get recall data
         * @param recallId
         */
        self.getRecallData = function (recallId) {

            self.state = self.states.LOADING;

            foodEnforcementService.getRecallById(recallId)
                .success(function (result) {
                    if (result.results && result.results.length) {
                        self.recall = result.results[0];

                        self.state = self.states.RESULT;

                        var upcCode = foodEnforcementService.extractUpc(self.recall);

                        factualUpcService.getData(upcCode).success(function (result) {
                            var products = factualUpcService.getProducts(result);
                            if (products && products.length) {
                                self.product = products[0];
                            }
                        });
                    }
                })
                .error(function(){
                    self.state = self.states.NORMAL;
                    //TODO: error state for bad input?
                });
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
    }
)
;
