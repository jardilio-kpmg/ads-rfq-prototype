var main = require('../main');

/**
 * @class <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(<%= headlessCamelCase(scaffold.name) %>) {
 *      <%= headlessCamelCase(scaffold.name) %>.getData(input1, input2, {option1: 'option1'})
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('<%= headlessCamelCase(scaffold.name) %>', function (/**kpmgAngular.services.kHttp*/ kHttp) {

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

    /**
     * @name <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>#getData
     * @methodOf <%= headlessCamelCase(scaffold.module) %>.services.<%= headlessCamelCase(scaffold.name) %>
     * @function
     * @param {string} required1
     * @param {string} required2
     * @param {object=} optionals
     * @returns  {{success: function, error: function}} HTTP Promise
     */
    self.getData = function (required1, required2, optionals) {
        return kHttp.get('/<%= hyphenCase(scaffold.module) %>/<%= hyphenCase(scaffold.name) %>/data', {
           params: angular.extend({
               required1: required1,
               required2: required2
           }, optionals)
        });
    };

    return self;

});
