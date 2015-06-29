var main = require('../main'),
    angular = require('angular');

/**
 * @class scan.controllers.ScanCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="ScanCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('scan').directive('mydirective', function () {
 *      return {
 *          controller: 'ScanCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var scanCtrl = controllers[0];
 *              scanCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('ScanCtrl', function () {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'ScanCtrl';

    /**
     * @name scan.controllers.ScanCtrl#getName
     * @methodOf scan.controllers.ScanCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    setTimeout(function () {
        angular.element('.scan.index.init').removeClass('init');
    });

});
