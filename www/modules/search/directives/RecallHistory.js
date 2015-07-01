var main = require('../main'),
    angular = require('angular'),
    nv = require('nvd3'),
    d3 = require('d3');

require('../../../libs/nvd3/nv.d3.css');
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
        scope: {
            recallHistoryData: '='
        },
        restrict: 'E',
        template: require('./RecallHistory.html'),
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            var svg = d3.select($elem.find('svg')[0]),
                win = angular.element(window),
                chart, legendSeries, chartUpdateDelay;

            /**
             * Change handler for the chart's data, which calls for
             * a chart update after a short delay. The delay is in
             * place to group multiple data updates made around the
             * same time.
             */
            function chartDataChanged() {
                clearTimeout(chartUpdateDelay);
                chartUpdateDelay = setTimeout(function() {
                    chartUpdateDelay = null;
                    updateData();
                }, 250);
            }

            /**
             * Update the chart based on the current set of data.
             */
            function updateData() {
                if (chart && $scope.recallHistoryData) {
                    svg.datum($scope.recallHistoryData)
                        .transition().duration(400)
                        .call(chart);

                    //Draw a rectangle behind each legend item to provide additional click area.
                    if($scope.recallHistoryData.length) {
                        legendSeries = svg.selectAll('.nv-legendWrap .nv-series');
                        legendSeries.each(function() {
                            var thisSeries = d3.select(this);

                            //I ran into an instance where more than one rect was drawn.
                            // This is here to prevent multiple rect shapes.
                            if(thisSeries && thisSeries.length && thisSeries[0].length && thisSeries[0][0].firstChild.tagName !== 'rect') {
                                thisSeries.insert('rect', ':first-child')
                                    .attr({
                                        height: 30,
                                        y: -16,
                                        width: 70,
                                        x: -12,
                                        fill: 'transparent'
                                    });
                            }
                        });
                    }

                    setTimeout(function() {
                        resizeChart();
                    }, 100);

                }
            }

            /**
             * Requests a chart redraw.
             */
            function resizeChart() {
                if (chart && chart.update) {
                    chart.update();
                }
            }

            //Set up and add the chart
            nv.addGraph(function() {
                chart = nv.models.multiBarChart()
                        .reduceXTicks(false)
                        .showYAxis(false)
                        .rotateLabels(0)
                        .stacked(true)
                        .showControls(false)
                        .groupSpacing(0.1)
                        .margin({left: 0, right: 0, top: 0, bottom: 30});

                chart.xAxis
                    .tickFormat(d3.format('f'));

                return chart;
            });

            resizeChart();

            $scope.$watch('recallHistoryData', chartDataChanged);

            $elem.addClass('search recall-history');
            win.on('resize', resizeChart);
            $scope.$on('$destroy', function () {
                win.off('resize', resizeChart);
            });
        }
    };
});
