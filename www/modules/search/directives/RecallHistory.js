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
                    svg.datum($scope.recallHistoryData)
                        .transition().duration(500)
                        .call(chart);
                }
            }

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
                        .margin({left: 0, right: 0, top: 0, button: 0})
                    ;

                chart.xAxis
                    .tickFormat(d3.format('f'));

                return chart;
            });

            resizeChart();

            $scope.$watch('recallHistoryData', updateData, true);

            $elem.addClass('search recall-history');
            win.on('resize', resizeChart);
            $scope.$on('$destroy', function () {
                win.off('resize', resizeChart);
            });
        }
    };
});
