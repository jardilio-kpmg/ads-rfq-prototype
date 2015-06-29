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
                chart;

            function updateData() {
                if (chart && $scope.recallHistoryData) {
                    var targetColor, chartColors = [];

                    //See which classifications are included in the data and set the chart colors.
                    angular.forEach($scope.recallHistoryData, function(chartDataItem) {
                        targetColor = '#1565C0';
                        if(chartDataItem.key === 'Class I') {
                            targetColor = '#FE0000';
                        }
                        else if(chartDataItem.key === 'Class II') {
                            targetColor = '#F47429';
                        }
                        else if(chartDataItem.key === 'Class III') {
                            targetColor = '#FEF200';
                        }
                        chartColors.push(targetColor);
                    });

                    chart.color(chartColors);
                    svg.datum($scope.recallHistoryData)
                        .transition().duration(500)
                        .call(chart);
                }
            }

            function resizeChart() {
                /*svg
                    .style('width', Math.max(350, $elem.height()))
                    .style('height', Math.max(300, $elem.height()));*/

                //console.log($elem.width(), $elem.height());

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
                        .margin({left: 0, right: 0, top: 0, button: 0})
                    ;

                chart.xAxis
                    .tickFormat(d3.format('f'));

                return chart;
            });

            resizeChart();

            $scope.$watch('recallHistoryData', updateData);

            $elem.addClass('recalls recall-history');
            win.on('resize', resizeChart);
            $scope.$on('$destroy', function () {
                win.off('resize', resizeChart);
            });
        }
    };
});
