var main = require('../main'),
    angular = require('angular'),
    nv = require('nvd3'),
    d3 = require('d3');

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
    /**openfda.services.foodEnforcementService*/ foodEnforcementService,
    /**factual.services.factualUpcService*/ factualUpcService,
    /**kpmg.filters.kLocalize*/ kLocalizeFilter) {

    var self = this,
        barcode, keywords;

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
     * The list of recall classification count results found
     * @name recalls.controllers.ClassificationDistributionCtrl#classificationData
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {array}
     */
    self.classificationData = null;

    /**
     * The description for the Class I category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class1Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    self.class1Description = kLocalizeFilter('recalls.classDistribution.class1Description');

    /**
     * The description for the Class II category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class2Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    self.class2Description = kLocalizeFilter('recalls.classDistribution.class2Description');

    /**
     * The description for the Class III category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class3Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    self.class3Description = kLocalizeFilter('recalls.classDistribution.class3Description');

    /**
     * Requests recall results based on the code or search terms provided.
     * @name recalls.controllers.ClassificationDistributionCtrl#searchByBarcode
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @param {string} barcode A UPC barcode string to search for.
     */
    self.searchByBarcode = function(value) {
        //No need to continue if we don't have a barcode to work with.
        if(!value) {
            return;
        }

        barcode = value;
        keywords = null;

        foodEnforcementService.getRecallsByBarcode(barcode, {'count': 'classification.exact'})
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
    };

    /**
     * Requests recall results based on one or more keyword strings.
     * @name recalls.controllers.ClassificationDistributionCtrl#searchByKeywords
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @param {string} keywords A string of search terms to match recall records against.
     */
    self.searchByKeywords = function(value) {
        if (!value) {
            return;
        }

        barcode = null;
        keywords = value;

        foodEnforcementService.getRecallsByKeyword(keywords, {'count': 'classification.exact'})
            .success(processResults)
            .error(processResults);
    };

    /**
     * @private
     * @param results {object}
     */
    function processResults(results) {
        results = (results && results.results) || [{term: '', count: 1}];
        self.classificationData = results;
        self.addPieChart(self.classificationData);
    }

    /**
     * Draws an empty placeholder chart.
     * @private
     */
    function drawEmptyChart() {
        self.addPieChart([{term: '', count: 1}]);
    }

    /**
     * Builds a pie chart based on the loaded data.
     * @name recalls.controllers.ClassificationDistributionCtrl#addPieChart
     * @methodOf recalls.controllers.ClassificationDistributionCtrl
     * @function
     * @param {Object} chartData The data used to populate the pie chart.
     */
    self.addPieChart = function(chartData) {
        if(nv) {
            var targetColor, chartColors = [];

            //See which classifications are included in the data and set the chart colors.
            angular.forEach(chartData, function(chartDataItem) {
                targetColor = '#1565C0';
                if(chartDataItem.term === 'Class I') {
                    targetColor = '#FE0000';
                } else if(chartDataItem.term === 'Class II') {
                    targetColor = '#F47429';
                } else if(chartDataItem.term === 'Class III') {
                    targetColor = '#FEF200';
                }
                chartColors.push(targetColor);
            });

            //Set up and add the chart
            nv.addGraph(function() {
                var chart = nv.models.pieChart()
                    .x(function(d) { return d.term; })
                    .y(function(d) { return d.count; })
                    .showLabels(false)
                    .showLegend(true)
                    .color(chartColors);

                d3.select('#class-distribution-chart svg')
                    .datum(chartData)
                    .transition().duration(350)
                    .call(chart);

                //TODO: This will move the legend below the chart but we need to figure out re-positioning after clicking a legend item.
                /*d3.select('.nv-legendWrap')
                    .attr('transform','translate(0,0)');*/

                return chart;
            });
        }
    };

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
            else if (!search.barcode && !search.keywords) {
                drawEmptyChart();
            }
        },
        true
    );

});
