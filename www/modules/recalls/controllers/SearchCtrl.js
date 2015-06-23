var main = require('../main'),
    angular = require('angular');

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
main.controller('SearchCtrl', function (/**ng.$rootScope.Scope*/ $scope, $location, /**recalls/services/RecallSearchService*/ recallSearchService) {

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

    self.barcode = $location.search().barcode;
    self.recalls = null;
    self.searchResultsFeedback = '';
    self.emptyResultsMessage = 'No Matches Found!';

    /**
     * Populates a feedback message.
     * @param [message] {string} A message to display. When omitted, an empty string will be used.
     */
    self.displayFeedback = function(message) {
        if(!message) {
            message = '';
        }
        self.searchResultsFeedback = message;
    };

    /**
     * Requests recall results based on the code or search terms provided.
     * @param barcode {string} A UPC barcode string to search for.
     */
    self.performSearchByBarcode = function(barcode) {
        //No need to continue if we don't have a barcode to work with.
        if(!barcode) {
            return;
        }

        recallSearchService.getRecallsByBarcode(barcode).success(function(result) {
            self.displayFeedback();
            self.recalls = result.results || [];
        }).error(function(error) {
            self.displayFeedback(error ? error.error.message : self.emptyResultsMessage);
            self.recalls = [];

            //TODO: Part of next phase where we use the barcode to get additional product data to search on.
            /*if(error && error.error.code === 'NOT_FOUND') {
                self.performSearchByBarcodeData(barcode);
            }*/
        });
    };

    /**
     * Requests recall results based on a barcode's product data.
     * @param barcode {string} A UPC barcode string to search for.
     */
    self.performSearchByBarcodeData = function(barcode) {
        //No need to continue if we don't have a barcode to work with.
        if(!barcode) {
            return;
        }

        //TODO: Implement when barcode service is ready.
        /*var barcodeData;

        recallSearchService.getBarcodeData(barcode).success(function(result) {
            //TODO: compile barcode data and pass to performSearchByKeyword([])
            self.performSearchByKeyword([]);
        }).error(function(error) {
            //No matching results after searching based on barcode product data. Move to manual search method.
            self.resetSearchResults();
        });*/
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @param keywords {array} An array of keyword strings to match recall records against.
     */
    self.performSearchByKeyword = function(keywords) {
        //No need to continue if we don't have keywords to work with.
        if(!angular.isArray(keywords)) {
            return;
        }

        recallSearchService.getRecallsByKeyword(keywords).success(function(result) {
            self.displayFeedback();
            self.recalls = result.results || [];
        }).error(function(error) {
            self.displayFeedback(error ? error.error.message : self.emptyResultsMessage);
            self.recalls = [];
        });
    };

    /**
     * Resets the recalls array and clears out any feedback messaging.
     */
    self.resetSearchResults = function() {
        self.displayFeedback();
        self.recalls = [];
    };

    /**
     * Search for recalls when this view loads based
     * on the provided search key (barcode).
     */
    if(self.barcode) {
        self.performSearchByBarcode(self.barcode);
    } else {
        self.resetSearchResults();
        self.displayFeedback(self.emptyResultsMessage);
    }

});
