var main = require('../main');

/**
 * @class scan.controllers.HomeScreenToastCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="HomeScreenToastCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('scan').directive('mydirective', function () {
 *      return {
 *          controller: 'HomeScreenToastCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var homeScreenToastCtrl = controllers[0];
 *              homeScreenToastCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('HomeScreenToastCtrl', function (/**ng.$rootScope.Scope*/ $scope, $mdToast) {

    var self = this;

    $scope.$on('$destroy', function () {
        //TODO: clean up work
    });

    //TODO: write your public controller logic into self, private members are in scope of this constructor
    //code below is for example purposes and may be safely removed (just remember to update the unit tests!)

    /**
     * @private
     * @type {string}
     */
    var name = 'HomeScreenToastCtrl';

    /**
     * @name scan.controllers.HomeScreenToastCtrl#getName
     * @methodOf scan.controllers.HomeScreenToastCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    self.isAndroid = false;

    self.isIos = true;

    self.closeToast = function() {
        $mdToast.cancel();
    };

    if( navigator.userAgent.match(/Android/i) ){
        self.isAndroid = true;
    } else if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        self.isIos = true;
    }
});
