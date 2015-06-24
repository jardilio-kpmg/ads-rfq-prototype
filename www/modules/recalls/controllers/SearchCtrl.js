var main = require('../main');

/**
 * @class recalls.controllers.SearchCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="SearchCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('recalls').directive('mydirective', function () {
 *      return {
 *          controller: 'SearchCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var searchCtrl = controllers[0];
 *              searchCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('SearchCtrl', function (
    /**ng.$rootScope.Scope*/ $scope,
    $location,
    /**openfda.services.foodEnforcementService*/ foodEnforcementService) {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'SearchCtrl';

    /**
     * @name recalls.controllers.SearchCtrl#getName
     * @methodOf recalls.controllers.SearchCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * The list of recall results found
     * @name recalls.controllers.SearchCtrl#barcode
     * @propertyOf recalls.controllers.SearchCtrl
     * @type {array}
     */
    self.recalls = null;

    /**
     * Requests recall results based on the code or search terms provided.
     * @name recalls.controllers.SearchCtrl#searchByBarcode
     * @methodOf recalls.controllers.SearchCtrl
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
                //TODO: can we get product info from barcode and do a keyword search?
            });
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @param {string} keywords An array of keyword strings to match recall records against.
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

    $scope.$watch(
        function () {
            return $location.search().barcode;
        },
        function (barcode) {
            self.searchByBarcode(barcode);
        }
    );

    $scope.$watch(
        function () {
            return $location.search().keywords;
        },
        function (keywords) {
            self.searchByKeywords(keywords);
        }
    );

});
