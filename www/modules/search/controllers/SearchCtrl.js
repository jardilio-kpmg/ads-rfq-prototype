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
                                        /**factual.services.factualUpcService*/ factualUpcService,
                                        $mdDialog,
                                        kLocalizeFilter) {

    var self = this,
        path = $location.path(),
        keywords, barcode,
        tempRecallHistoryData = [],
        recallHistoryExpectedCheckInPoints = 4,
        recallHistoryCheckInPoints = 0;

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
     * The list of recall history results found
     * @name search.controllers.SearchCtrl#recallHistoryData
     * @propertyOf search.controllers.SearchCtrl
     * @type {array}
     */
    self.recallHistoryData = [];

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
                            //self.searchByKeywords(products[0].name);
                            $mdDialog.show(
                                $mdDialog.confirm()
                                    .title(kLocalizeFilter('search.fuzzyMatch.title'))
                                    .content(kLocalizeFilter('search.fuzzyMatch.content', {
                                        keywords: products[0].name,
                                        upc: barcode
                                    }))
                                    .ok(kLocalizeFilter('search.fuzzyMatch.ok'))
                                    .cancel(kLocalizeFilter('search.fuzzyMatch.cancel'))
                            )
                                .then(function () {
                                    self.searchByKeywords(products[0].name);
                                });
                        }
                        else {
                            processResults(null);
                        }
                    })
                    .error(processResults);
            });

        foodEnforcementService.getRecallsByBarcode(barcode, {count: 'classification.exact'})
            .success(processClassification)
            .error(processClassification);

        getRecallHistoryData(barcode, null);
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

        getRecallHistoryData(null, keywords);
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

    /**
     * This function will request data for the Recall History chart.
     * The chart shows data for the past 5 years, and we've taken the approach
     * to request the data for each year individually. Since the openFDA api
     * returns an error when no matches are found, we didn't want to cause the
     * request as a whole to fail if data for one year couldn't be located.
     * Each year will be processed individually with results being pushed in to
     * one common array for final processing and binding in the chart.
     * @param barcode {string} A UPC barcode string to search for.
     * @param keywords {string} A list of search strings to search by.
     */
    function getRecallHistoryData(barcode, keywords) {
        var years = [],
            thisYear = new Date().getFullYear();

        //Reset the number of request that have been handled.
        recallHistoryCheckInPoints = 0;

        //Establish the base chart data and classification colors.
        tempRecallHistoryData = [{key: 'Class I', color: '#FE0000', values: []},
            {key: 'Class II', color: '#F47429', values: []},
            {key: 'Class III', color: '#FEF200', values: []}];

        //Get history for the last 5 years, including this year. We'll build the list of years and then make the requests.
        for(var y = thisYear - 3; y <= thisYear; y++) {
            years.push(y);
        }

        /* jshint -W083 */
        angular.forEach(years, function(year) {
            if(barcode) {
                foodEnforcementService.getRecallTrendsByBarcode(barcode, year + '0101', year + '1231')
                    .success(function(results) {
                        processRecallHistorySearchSuccess(year, results);
                    })
                    .error(function() {
                        processRecallHistorySearchError(year);
                    });
            } else if(keywords) {
                foodEnforcementService.getRecallTrendsByKeyword(keywords, year + '0101', year + '1231')
                    .success(function(results) {
                        processRecallHistorySearchSuccess(year, results);
                    })
                    .error(function() {
                        processRecallHistorySearchError(year);
                    });
            }
        });
        /* jshint +W083 */
    }

    /**
     * This is a success handler for the openFDA api request for classification counts
     * for a particular year. This handler pulls the classification counts and then
     * inserts them in to the temporary chart data. Once all requests have been handled
     * this temporary data will be used to update the chart's main data set.
     * @param year {number} The year that data was requested for.
     * @param results {object} The promise object returned from the openFDA api request.
     */
    function processRecallHistorySearchSuccess(year, results) {
        var class1Count, class2Count, class3Count;

        //Pull the counts for our classification groups.
        //The result object is structured like this: {term: 'i', count: 45}
        angular.forEach(results.results, function(result) {
            switch(result.term) {
                case 'i':
                    class1Count = result.count;
                    break;
                case 'ii':
                    class2Count = result.count;
                    break;
                case 'iii':
                    class3Count = result.count;
                    break;
            }
        });

        //Apply the classification group counts.
        angular.forEach(tempRecallHistoryData, function(recallClass) {
            switch(recallClass.key) {
                case 'Class I':
                    recallClass.values.push({x: year, y: class1Count ? class1Count : 0});
                    break;
                case 'Class II':
                    recallClass.values.push({x: year, y: class2Count ? class2Count : 0});
                    break;
                case 'Class III':
                    recallClass.values.push({x: year, y: class3Count ? class3Count : 0});
                    break;
            }
        });
        recallHistorySearchCheckIn();
    }

    /**
     * The openFDA api returns an error if no matches are found.
     * We'll set a count of zero for a request that fails for a
     * particular year.
     * @param year
     */
    function processRecallHistorySearchError(year) {
        angular.forEach(tempRecallHistoryData, function(recallClass) {
            switch(recallClass.key) {
                case 'Class I':
                    recallClass.values.push({x: year, y: 0});
                    break;
                case 'Class II':
                    recallClass.values.push({x: year, y: 0});
                    break;
                case 'Class III':
                    recallClass.values.push({x: year, y: 0});
                    break;
            }
        });
        recallHistorySearchCheckIn();
    }

    /**
     * Since we're requesting classification counts for each
     * year independently, this function will be used to track
     * how many of the expected responses have been handled.
     * When we get a response from each call made, we'll move
     * on to our finalize method to update the chart's data source.
     */
    function recallHistorySearchCheckIn() {
        recallHistoryCheckInPoints++;

        if(recallHistoryCheckInPoints === recallHistoryExpectedCheckInPoints) {
            finalizeRecallHistorySearch();
        }
    }

    /**
     * This is responsible for sorting the data values for a
     * classification group by year. The NVD3 multiBarChart
     * has been set up to display years based on values in the
     * value.x property.
     * @param data1 {object} The first data item to sort
     * @param data2 {object} The second data item to sort
     * @returns {number}
     */
    function recallHistorySort(data1, data2) {
        return data1.x - data2.x;
    }

    /**
     * This is the final step run when compiling the data for
     * the Recall History chart. We'll sort the data for each
     * classification group and pass the temporary data to the
     * chart's main data source so it will redraw with the new data.
     */
    function finalizeRecallHistorySearch() {
        //Sort the value arrays for each classification entry so years are displayed in the correct order.
        angular.forEach(tempRecallHistoryData, function(recallClass) {
            recallClass.values.sort(recallHistorySort);
        });

        //Update the Recall History chart's main data source.
        self.recallHistoryData = null;
        self.recallHistoryData = tempRecallHistoryData;
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
