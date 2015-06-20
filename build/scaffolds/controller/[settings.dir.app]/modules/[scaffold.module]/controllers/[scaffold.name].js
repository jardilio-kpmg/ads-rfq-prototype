var main = require('../main');

/**
 * @class <%= headlessCamelCase(scaffold.module) %>.controllers.<%= camelCase(scaffold.name) %>
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="<%= camelCase(scaffold.name) %> as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('<%= headlessCamelCase(scaffold.module) %>').directive('mydirective', function () {
 *      return {
 *          controller: '<%= camelCase(scaffold.name) %>',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var <%= headlessCamelCase(scaffold.name) %> = controllers[0];
 *              <%= headlessCamelCase(scaffold.name) %>.getName();
 *          }
 *      };
 * });
 */
main.controller('<%= camelCase(scaffold.name) %>', function (/**ng.$rootScope.Scope*/ $scope) {

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
    var name = '<%= scaffold.name %>';

    /**
     * @name <%= headlessCamelCase(scaffold.module) %>.controllers.<%= camelCase(scaffold.name) %>#getName
     * @methodOf <%= headlessCamelCase(scaffold.module) %>.controllers.<%= camelCase(scaffold.name) %>
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

});
