var main = require('../main');

/**
 * @name recalls.directives.scan-button
 * @propertyOf recalls.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <md-button scan-button></md-button>
 */
main.directive('scanButton', function () {

    return {
        controller: 'ScanButtonCtrl',
        require: ['scanButton'],
        restrict: 'A',
        link: function ($scope, $elem, $attr, controllers) {// jshint ignore:line
            /**
             * @type {recalls.controllers.ScanButtonCtrl}
             */
            var scanButton = controllers[0];
            $elem.on('click', function () {
                $scope.$apply(function () {
                    scanButton.startScan();
                });
            });
            $elem.addClass('ads scan-button');
        }
    };

});
