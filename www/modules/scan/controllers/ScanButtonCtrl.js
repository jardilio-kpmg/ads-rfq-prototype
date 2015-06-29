var main = require('../main'),
    angular = require('angular'),
    Quagga = require('quagga');

/**
 * @class recalls.controllers.ScanButtonCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="ScanButtonCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('recalls').directive('mydirective', function () {
 *      return {
 *          controller: 'ScanButtonCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var scanButtonCtrl = controllers[0];
 *              scanButtonCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('ScanButtonCtrl', function (/**ng.$rootScope.Scope*/ $scope, $location, $mdDialog, kLocalizeFilter) {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'ScanButtonCtrl';

    /**
     * @name recalls.controllers.ScanButtonCtrl#getName
     * @methodOf recalls.controllers.ScanButtonCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * Initiates a new barcode scan read from an image or camera capture
     * @name recalls.controllers.ScanButtonCtrl#startScan
     * @methodOf recalls.controllers.ScanButtonCtrl
     * @function
     */
    self.startScan = function () {
        var input = angular.element('<input type="file" style="display:none;" accept="image/*;capture=camera">');
        angular.element(document.body).append(input);
        input.on('change', function () {
            var files = input.prop('files') || [],
                file = files[0];
            if (file) {
                input.remove();
                //TODO: might need to tweak this, just playing around with multiple scan settings to try an get a hit
                decodeFile(window.URL.createObjectURL(file), [
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'medium',
                            halfSample: true
                        }
                    },
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'large',
                            halfSample: true
                        }
                    },
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'small',
                            halfSample: true
                        }
                    },
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'medium',
                            halfSample: false
                        }
                    },
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'large',
                            halfSample: false
                        }
                    },
                    {
                        inputStream: {
                            size: 640
                        },
                        locator: {
                            patchSize: 'small',
                            halfSample: false
                        }
                    }
                ]);
            }
        });
        input.trigger('click');
    };

    function decodeFile(file, options) {
        var option = options.shift();
        Quagga.decodeSingle(
            angular.extend({
                inputStream: {
                    size: 640
                },
                locator: {
                    patchSize: 'medium',
                    halfSample: true
                },
                numOfWorkers: 1,
                decoder: {
                    readers: [
                        'upc_reader',
                        'upc_e_reader'
                    ]
                },
                src: file
            }, option),
            function (result) {
                if (result && result.codeResult && result.codeResult.code) {
                    $scope.$apply(function () {
                        $location.path('/search');
                        $location.search({barcode: result.codeResult.code});
                    });
                }
                else if (options && options.length) {
                    setTimeout(function () {
                        decodeFile(file, options);
                    });
                }
                //TODO: we could leverage a server side solution to try and scan the image as a backup
                else {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .title(kLocalizeFilter('scan.noBarcodeFound.title'))
                            .content(kLocalizeFilter('scan.noBarcodeFound.message'))
                            .ok(kLocalizeFilter('scan.noBarcodeFound.ok'))
                    );
                }
            }
        );
    }

});
