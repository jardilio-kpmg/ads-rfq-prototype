var main = require('../main'),
    angular = require('angular');

/**
 * @class search.controllers.SearchCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="SearchCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('search').directive('mydirective', function () {
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
main.controller('SearchCtrl', function (/**ng.$rootScope.Scope*/ $scope, $timeout,
                                        /**ng.$location*/ $location,
                                        /**openfda.services.foodEnforcementService*/ foodEnforcementService,
                                        /**factual.services.factualUpcService*/ factualUpcService) {

    var self = this,
        path = $location.path(),
        keywords, barcode;

    /**
     * @private
     * @type {string}
     */
    var name = 'SearchCtrl';

    /**
     * @name search.controllers.SearchCtrl#getName
     * @methodOf search.controllers.SearchCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * The list of recall results found
     * @name search.controllers.SearchCtrl#recalls
     * @propertyOf search.controllers.SearchCtrl
     * @type {array}
     */
    self.recalls = null;

    /**
     * The list of recall results counted by classification
     * @name search.controllers.SearchCtrl#classifications
     * @propertyOf search.controllers.SearchCtrl
     * @type {array}
     */
    self.classifications = null;

    /**
     * Requests recall results based on the code or search terms provided.
     * @name search.controllers.SearchCtrl#searchByBarcode
     * @methodOf search.controllers.SearchCtrl
     * @function
     * @param {string} barcode A UPC barcode string to search for.
     */
    self.searchByBarcode = function (value) {
        //No need to continue if we don't have a barcode to work with.
        if (!value) {
            return;
        }

        barcode = value;
        keywords = null;
        self.state = self.states.SEARCHING;
        $location.search({keywords: keywords, barcode: barcode});
        $location.replace();

        blur();

        foodEnforcementService.getRecallsByBarcode(barcode)
            .success(processResults)
            .error(function () {
                // get product info from barcode and do a keyword search
                factualUpcService.getData(barcode)
                    .success(function (result) {
                        var products = factualUpcService.getProducts(result);
                        if (products && products.length) {
                            self.searchByKeywords(products[0].name);
                        }
                        else {
                            processResults(null);
                        }
                    })
                    .error(processResults);
            });

        foodEnforcementService.getRecallsByKeyword(keywords, {count: 'classification.exact'})
            .success(processClassification)
            .error(processClassification);
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @name search.controllers.SearchCtrl#searchByKeywords
     * @methodOf search.controllers.SearchCtrl
     * @function
     * @param {string} keywords A string of terms to match recall records against.
     */
    self.searchByKeywords = function (value) {
        if (!value) {
            return;
        }

        barcode = null;
        keywords = value;
        self.state = self.states.SEARCHING;
        $location.search({keywords: keywords, barcode: barcode});
        $location.replace();

        blur();

        foodEnforcementService.getRecallsByKeyword(keywords)
            .success(processResults)
            .error(processResults);

        foodEnforcementService.getRecallsByKeyword(keywords, {count: 'classification.exact'})
            .success(processClassification)
            .error(processClassification);
    };

    /**
     * Resets the search-related properties so the user can search
     * for another barcode or keyword.
     * @name search.controllers.SearchCtrl#resetSearchForm
     * @methodOf search.controllers.SearchCtrl
     * @function
     */
    self.resetSearchForm = function () {
        $location.search({keywords: null, barcode: null});
        $location.replace();
        self.recalls = null;
        self.state = self.states.SEARCH;
    };

    self.states = {
        SEARCH: 0,
        SEARCHING: 1,
        RESULTS: 2
    };

    self.state = self.states.SEARCH;

    // TODO: whats up with this in jshint? Its referenced twice above
    function blur() {// jshint ignore:line
        //fix issue with soft keyboard sticking
        angular.element('input').blur();
    }

    function processResults(results) {
        results = (results && results.results) || [];
        if (results.length === 1) {
            $location.search({});
            $location.replace();
            $timeout(function () {
                $location.path('/recall/' + results[0]['@id']);// jshint ignore:line
            });
            return;
        }
        self.recalls = results;
        self.state = self.recalls.length ? self.states.RESULTS : self.states.SEARCH;
    }

    function processClassification(results) {
        self.classifications = (results && results.results) || [];
    }

    var search = {};

    $scope.$watch(
        function () {
            var s = $location.search();
            search.barcode = s.barcode;
            search.keywords = s.keywords;
            return search;
        },
        function (search) {
            if (search.barcode && search.barcode !== barcode) {
                self.searchByBarcode(search.barcode);
            }
            else if (search.keywords && search.keywords !== keywords) {
                self.searchByKeywords(search.keywords);
            }
            else if (!search.barcode && !search.keywords && path === $location.path()) {
                self.resetSearchForm();
            }
        },
        true
    );

});
