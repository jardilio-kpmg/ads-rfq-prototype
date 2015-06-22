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
    self.selecting = false;
    self.searchResultsFeedback = '';

    self.toggleItemSelection = function (item) {
        item.$selected = !item.$selected;
        if (item.$selected) {
            self.selecting = true;
        }
        else {
            var i = 0, len = self.recalls ? self.recalls.length : 0;
            for (i; i < len; i++) {
                if (self.recalls[i].$selected) {
                    self.selecting = true;
                    return;
                }
            }
            self.selecting = false;
        }
    };

    self.selectAllItems = function () {
        angular.forEach(self.recalls, function (item) {
            item.$selected = true;
        });
        self.selecting = true;
    };

    self.unselectAllItems = function () {
        angular.forEach(self.recalls, function (item) {
            item.$selected = false;
        });
        self.selecting = false;
    };

    /**
     * Requests recall results based on the code or search terms provided.
     * @param barcode {string} A UPC barcode string to search for.
     */
    self.performSearchByBarcode = function(barcode) {
        recallSearchService.getRecallsByBarcode(barcode).success(function (result) {
            self.searchResultsFeedback = '';
            self.recalls = result.results;
        }).error(function(error) {
            self.searchResultsFeedback = error.error.message;
            self.recalls = [];

            if(error.error.code === 'NOT_FOUND') {
                //TODO: If no results then call to service that will try and get more product info from the supplied upc and then call performSearchByKeyword
                self.performSearchByKeyword(['chocolate']);
            }
        });
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @param keywords {array} An array of keyword strings to match recall records against.
     */
    self.performSearchByKeyword = function(keywords) {
        recallSearchService.getRecallsByKeyword(keywords).success(function (result) {
            self.searchResultsFeedback = 'No Exact Matches Found!';
            self.recalls = result.results;
        }).error(function(error) {
            self.searchResultsFeedback = error.error.message;
            self.recalls = [];
        });
    };


    /**
     * Search for recalls when this view loads based
     * on the provided search key (code).
     */
    self.performSearchByBarcode(self.barcode);
});
