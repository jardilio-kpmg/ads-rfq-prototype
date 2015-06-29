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
                chart, legendSeries;

            function updateData() {
                if (chart && $scope.counts) {
                    var class1Data, class2Data, class3Data, compiledCounts;

                    //Determine which classifications we've received from the openFDA api call and set colors.
                    angular.forEach($scope.counts, function(chartDataItem) {
                        switch(chartDataItem.term) {
                            case 'Class I':
                                class1Data = chartDataItem;
                                break;
                            case 'Class II':
                                class2Data = chartDataItem;
                                break;
                            case 'Class III':
                                class3Data = chartDataItem;
                                break;
                        }
                    });

                    //Compile the classification counts and use defaults if a classification wasn't included.
                    compiledCounts = [class1Data || {term: 'Class I', count: 0},
                        class2Data || {term: 'Class II', count: 0},
                        class3Data || {term: 'Class III', count: 0}];

                    //Set the chart's colors for Class I, Class II, Class III in this order.
                    chart.color(['#FE0000', '#F47429', '#FEF200']);

                    svg.datum(compiledCounts)
                        .transition().duration(500)
                        .call(chart);

                    //Draw a rectangle behind each legend item to provide additional click area.
                    legendSeries = svg.selectAll('.nv-legendWrap .nv-series');
                    legendSeries.each(function() {
                        var thisSeries = d3.select(this);

                        if(thisSeries) {
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
            }

            function resizeChart() {
                svg
                    .style('width', Math.max(300, $elem.height()))
                    .style('height', Math.max(300, $elem.height()));

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
