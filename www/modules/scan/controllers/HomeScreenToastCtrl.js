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

    /**
     * A flag that will be true when the user is viewing
     * the app on an Android device.
     * @name scan.controllers.HomeScreenToastCtrl#isAndroid
     * @propertyOf scan.controllers.HomeScreenToastCtrl
     * @property
     * @type {boolean}
     */
    self.isAndroid = false;

    /**
     * A flag that will be true when the user is viewing
     * the app on an iOS device.
     * @name scan.controllers.HomeScreenToastCtrl#isIos
     * @propertyOf scan.controllers.HomeScreenToastCtrl
     * @type {boolean}
     */
    self.isIos = false;

    /**
     * Click handler for the Close X button. Closes the
     * MD Toast panel.
     * @name scan.controllers.HomeScreenToastCtrl#closeToast
     * @methodOf scan.controllers.HomeScreenToastCtrl
     * @function
     */
    self.closeToast = function() {
        $mdToast.cancel();
    };

    //Determine whether the user is using an Android or iOS device.
    if( navigator.userAgent.match(/Android/i) ){
        self.isAndroid = true;
    } else if(navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) {
        self.isIos = true;
    }
});
