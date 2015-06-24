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
                                           /**openfda.services.FoodEnforcementService*/ foodEnforcementService) {

    'use strict';

    var self = this, search = $location.search();

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

    self.barcode = search.barcode;

    self.recall = null;

    self.activeRecallsText = 0;

    self.pastRecallsText = 0;

    self.getRecallData = function () {

        /* Bug in service
         foodEnforcementService.getRecallById(self.recallId)
         .success(function (result) {
         if (result.results && result.results.length){
         self.recall = result.results[0];
         }
         });
         */

        foodEnforcementService.getRecallsByBarcode(self.barcode).success(function (result) {

            if (result.results && result.results.length) {
                var recalls = $.grep(result.results, function (recall) {
                    return recall.recall_number === self.recallId;
                });
                if (recalls.length) {
                    self.recall = recalls[0];
                }
                var activeRecalls = $.grep(result.results, function (recall) {
                    return recall.status === "Ongoing";
                });
                self.activeRecallsText = activeRecalls.length + " Active Recall" + (activeRecalls.length !== 1 ? "s" : "");
                var pastRecalls = $.grep(result.results, function (recall) {
                    return recall.status !== "Ongoing";
                });
                self.pastRecallsText = pastRecalls.length + " Past Recall" + (pastRecalls.length !== 1 ? "s" : "");
            }
        });
    };

    self.getRecallData();
});
