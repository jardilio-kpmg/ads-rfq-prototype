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
main.controller('ScanCtrl', function ($scope, $mdToast) {

    var self = this,
        isTargetMobile = false,
        homescreenToastPosition = 'top right';

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

    /**
     * Displays a MD Toast with a message that explains
     * how to add the app to the user's Homescreen when
     * running on iOS or Android.
     * @private
     */
    function showSaveToHomeScreenToast() {
        $mdToast.show({
            controller: 'HomeScreenToastCtrl',
            controllerAs: 'toast',
            template: require('../views/HomeScreenToast.html'),
            hideDelay: 4000,
            position: homescreenToastPosition
        });
    }

    setTimeout(function () {
        angular.element('.scan.index.init').removeClass('init');
    });

    //Perform a basic check to detect if the browser is running on an iOS or Android device.
    //With this approach, we won't be able to specifically determine the browser but we'll get a rough idea.
    if(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)){
        isTargetMobile = true;
    }

    //Position the toast on the bottom portion of the screen when running on iPhone or iPod
    if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i)) && navigator.platform.match(/iP/i)) {
        homescreenToastPosition = 'bottom right';
    }

    //Show the Add to Home Screen message if it has not already been shown.
    if(typeof(Storage) !== 'undefined') {
        if(!localStorage.homescreenMsgDisplayed && !navigator.standalone && isTargetMobile) {
            //Set local storage so toast is not displayed again.
            localStorage.homescreenMsgDisplayed = true;
            //Show Add to Homescreen toast
            showSaveToHomeScreenToast();
        }
    }
});
