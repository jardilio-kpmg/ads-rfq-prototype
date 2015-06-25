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
    /**ng.$location*/ $location,
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
     * The model for the manual search input.
     * @name recalls.controllers.SearchCtrl#manualSearch
     * @propertyOf recalls.controllers.SearchCtrl
     * @type {string}
     */
    self.manualSearch = null;

    /**
     * The list of recall results found
     * @name recalls.controllers.SearchCtrl#recalls
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
     * @name recalls.controllers.SearchCtrl#searchByKeywords
     * @methodOf recalls.controllers.SearchCtrl
     * @function
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

    /**
     * Resets the search-related properties so the user can search
     * for another barcode or keyword.
     * @name recalls.controllers.SearchCtrl#resetSearchForm
     * @methodOf recalls.controllers.SearchCtrl
     * @function
     */
    self.resetSearchForm = function() {
        $location.search({keywords: null, barcode: null});
        self.recalls = null;
    };

    /**
     * Perform a manual search based on keywords entered by user.
     * @name recalls.controllers.SearchCtrl#doSearch
     * @methodOf recalls.controllers.SearchCtrl
     * @function
     */
    self.doSearch = function() {
        self.searchByKeywords(self.manualSearch);
    };

    if ($location.search().barcode) {
        self.searchByBarcode($location.search().barcode);
    }
    else if ($location.search().keywords) {
        self.searchByKeywords($location.search().keywords);
    }

});
