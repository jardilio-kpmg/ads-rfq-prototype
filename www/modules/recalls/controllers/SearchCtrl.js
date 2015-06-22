var main = require('../main'),
    angular = require('angular');

/**
 * @class recalls.controllers.SearchCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="SearchCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('recalls').directive('mydirective', function () {
 *      return {
 *          controller: 'SearchCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var searchCtrl = controllers[0];
 *              searchCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('SearchCtrl', function (/**ng.$rootScope.Scope*/ $scope, $location) {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'SearchCtrl';

    /**
     * @name recalls.controllers.SearchCtrl#getName
     * @methodOf recalls.controllers.SearchCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    self.barcode = $location.search().barcode;
    self.recalls = [{id:1},{id:2},{id:3},{id:4},{id:5}];
    self.selecting = false;

    self.toggleItemSelection = function (item) {
        item.$selected = !item.$selected;
        if (item.$selected) {
            self.selecting = true;
        }
        else {
            var i = 0, len = self.recalls ? self.recalls.length : 0;
            for (i; i < len; i++) {
                if (self.recalls[i].$selected) {
                    self.selecting = true;
                    return;
                }
            }
            self.selecting = false;
        }
    };

    self.selectAllItems = function () {
        angular.forEach(self.recalls, function (item) {
            item.$selected = true;
        });
        self.selecting = true;
    };

    self.unselectAllItems = function () {
        angular.forEach(self.recalls, function (item) {
            item.$selected = false;
        });
        self.selecting = false;
    };

    //TODO: integrate with service and perform search

});
