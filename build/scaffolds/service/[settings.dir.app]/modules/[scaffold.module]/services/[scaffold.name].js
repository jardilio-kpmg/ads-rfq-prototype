var main = require('../main');

/**
 * @class <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>
 * @see https://docs.angularjs.org/guide/services
 * @example
 * function MyCtrl(<%= headlessCamelCase(scaffold.name) %>) {
 *      <%= headlessCamelCase(scaffold.name) %>.getName();
 * }
 */
main.service('<%= headlessCamelCase(scaffold.name) %>', function () {

    var self = this;

    //TODO: write your public service logic into self, private members are in scope of this constructor
    //code below is for example purposes and may be safely removed (just remember to update the unit tests!)

    /**
     * @private
     * @type {string}
     */
    var name = '<%= scaffold.name %>';

    /**
     * @name <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>#getName
     * @methodOf <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    return self;

});
