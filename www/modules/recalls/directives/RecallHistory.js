var main = require('../main'),
    angular = require('angular'),
    nv = require('nvd3'),
    d3 = require('d3');

require('./RecallHistory.scss');

/**
 * @name recalls.directives.recall-history
 * @propertyOf recalls.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <recall-history></recall-history>
 */
main.directive('recallHistory', function () {

    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: {
            recallHistoryData: '=recallHistoryData'
        },
        //controller: 'RecallHistoryCtrl',
        //controllerAs: 'recallHistory',
        //optional string name to require another directive to exist on target element
        require: [],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'E',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: require('./RecallHistory.html'),
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line

            /**
             * Builds a stacked bar chart based on the loaded data.
             * @name addBarChart
             * @function
             * @param {Object} chartData The data used to populate the pie chart.
             */
            function addBarChart(chartData) {
                if(nv) {
                    var targetColor, chartColors = [];

                    if(!chartData) {
                        chartData = [{term: '', count: 1}];
                    }

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
                    //TODO: Example: http://nvd3.org/examples/multiBar.html
                    nv.addGraph(function() {
                        var chart = nv.models.pieChart()
                            .x(function(d) { return d.term; })
                            .y(function(d) { return d.count; })
                            .showLabels(false)
                            .showLegend(true)
                            .color(chartColors);

                        d3.select('#recall-history-chart svg')
                            .datum(chartData)
                            .transition().duration(350)
                            .call(chart);

                        //TODO: This will move the legend below the chart but we need to figure out re-positioning after clicking a legend item.
                        /*d3.select('.nv-legendWrap')
                         .attr('transform','translate(0,0)');*/

                        return chart;
                    });
                }
            }

            /**
             * Monitor changes in the data bound to this directive's
             * recall-history-data attribute. We'll draw a chart based
             * on the data.
             */
            $scope.$watch('recallHistoryData', function(newChartData) {
                addBarChart(newChartData);
            });

            $elem.addClass('recalls recall-history');
            $scope.$on('$destroy', function () {
                //TODO: clean up work
            });
        }
    };

});
