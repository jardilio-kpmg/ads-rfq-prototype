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
                                           /**openfda.services.FoodEnforcementService*/ foodEnforcementService) {

    'use strict';

    var self = this;

    $scope.$on('$destroy', function () {
        //TODO: clean up work
    });

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

    self.recallId = $routeParams.recallId;

    self.recall = null;


    self.getRecallData = function () {

        foodEnforcementService.getRecallById(self.recallId)
            .success(function (result) {
                if (result.results && result.results.length){
                    self.recall = result.results[0];
                }
            });
    };

    self.getRecallData();
});
