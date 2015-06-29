var main = require('../main'),
    nv = require('nvd3'),
    d3 = require('d3'),
    angular = require('angular');

require('../../../libs/nvd3/nv.d3.css');
require('./ClassificationDistribution.scss');

/**
 * @name search.directives.classification-distribution
 * @propertyOf search.directives
 * @see http://docs.angularjs.org/guide/directive
 * @examplewidth: 300px;
 height: 300px;
 * <classification-distribution counts="counts"></classification-distribution>
 */
main.directive('classificationDistribution', function () {

    return {
        scope: {
            counts: '='
        },
        restrict: 'E',
        template: require('./ClassificationDistribution.html'),
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            var svg = d3.select($elem.find('svg')[0]),
                win = angular.element(window),
                chart;

            function updateData() {
                if (chart && $scope.counts) {
                    var targetColor, chartColors = [];

                    //See which classifications are included in the data and set the chart colors.
                    angular.forEach($scope.counts, function(chartDataItem) {
                        targetColor = '#1565C0';
                        if(chartDataItem.term === 'Class I') {
                            targetColor = '#FE0000';
                        }
                        else if(chartDataItem.term === 'Class II') {
                            targetColor = '#F47429';
                        }
                        else if(chartDataItem.term === 'Class III') {
                            targetColor = '#FEF200';
                        }
                        chartColors.push(targetColor);
                    });

                    chart.color(chartColors);
                    svg.datum($scope.counts)
                        .transition().duration(500)
                        .call(chart);
                }
            }

            function resizeChart() {
                svg
                    .style('width', Math.max(300, $elem.height()))
                    .style('height', Math.max(300, $elem.height()));

                console.log($elem.width(), $elem.height());

                if (chart && chart.update) {
                    chart.update();
                }
            }

            //Set up and add the chart
            nv.addGraph(function() {
                chart = nv.models.pieChart()
                    .x(function(d) { return d.term; })
                    .y(function(d) { return d.count; })
                    .showLabels(false)
                    .showLegend(true);

                return chart;
            });

            resizeChart();

            $scope.$watch('counts', updateData);

            $elem.addClass('search classification-distribution');
            win.on('resize', resizeChart);
            $scope.$on('$destroy', function () {
                win.off('resize', resizeChart);
            });
        }
    };

});
