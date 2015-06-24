var main = require('../main');

/**
 * @class recalls.controllers.ClassificationDistributionCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="ClassificationDistributionCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('recalls').directive('mydirective', function () {
 *      return {
 *          controller: 'ClassificationDistributionCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var classificationDistributionCtrl = controllers[0];
 *              classificationDistributionCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('ClassificationDistributionCtrl', function (
    /**ng.$rootScope.Scope*/ $scope,
    $location,
    /**openfda.services.foodEnforcementService*/ foodEnforcementService) {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'ClassificationDistributionCtrl';

    /**
     * @name recalls.controllers.ClassificationDistributionCtrl#getName
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * The list of recall results found
     * @name recalls.controllers.ClassificationDistributionCtrl#recalls
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {array}
     */
    self.recalls = null;

    /**
     * Requests recall results based on the code or search terms provided.
     * @name recalls.controllers.ClassificationDistributionCtrl#searchByBarcode
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @param {string} barcode A UPC barcode string to search for.
     */
    self.searchByBarcode = function(barcode) {
        //No need to continue if we don't have a barcode to work with.
        if(!barcode) {
            return;
        }

        $location.search({keywords: null, barcode: barcode});

        foodEnforcementService.getRecallsByBarcode(barcode)
            .success(function(result) {
                self.recalls = result.results || [];
            })
            .error(function() {
                self.recalls = [];
            });
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @name recalls.controllers.ClassificationDistributionCtrl#searchByKeywords
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @param {string} keywords A string of search terms to match recall records against.
     */
    self.searchByKeywords = function(keywords) {
        if (!keywords) {
            return;
        }

        $location.search({keywords: keywords, barcode: null});

        foodEnforcementService.getRecallsByKeyword(keywords)
            .success(function(result) {
                self.recalls = (result && result.results) || [];
            })
            .error(function() {
                self.recalls = [];
            });
    };





    if ($location.search().barcode) {
        self.searchByBarcode($location.search().barcode);
    }
    else if ($location.search().keywords) {
        self.searchByKeywords($location.search().keywords);
    }

});
