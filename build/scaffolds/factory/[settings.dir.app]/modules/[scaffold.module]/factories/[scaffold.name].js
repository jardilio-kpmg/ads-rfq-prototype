var main = require('../main');

/**
 * @class <%= headlessCamelCase(scaffold.module) %>.factories.<%= camelCase(scaffold.name) %>
 * @see https://docs.angularjs.org/guide/services
 * @example
 * function MyCtrl(<%= camelCase(scaffold.name) %>) {
 *      var <%= headlessCamelCase(scaffold.name) %> = new <%= camelCase(scaffold.name) %>();
 *      <%= headlessCamelCase(scaffold.name) %>.getName();
 * }
 */
main.factory('<%= camelCase(scaffold.name) %>', function () {

    return function () {
        var self = this;

        //TODO: write your public factory logic into self, private members are in scope of this constructor
        //code below is for example purposes and may be safely removed (just remember to update the unit tests!)

        /**
         * @private
         * @type {string}
         */
        var name = '<%= scaffold.name %>';

        /**
         * @name <%= headlessCamelCase(scaffold.module) %>.factories.<%= camelCase(scaffold.name) %>#getName
         * @methodOf <%= headlessCamelCase(scaffold.module) %>.factories.<%= camelCase(scaffold.name) %>
         * @function
         * @returns {string}
         */
        self.getName = function () {
            return name;
        };
    };

});
