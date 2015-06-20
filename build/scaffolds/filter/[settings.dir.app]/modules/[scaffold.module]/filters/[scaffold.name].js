var main = require('../main');

/**
 * @name <%= headlessCamelCase(scaffold.module) %>.filters.#<%= headlessCamelCase(scaffold.name) %>
 * @memberOf <%= headlessCamelCase(scaffold.module) %>.filters
 * @function
 * @param {string} input
 * @return {string}
 * @see http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
 * @example {@lang xml}
 * <span>{{someScopeExpression|<%= headlessCamelCase(scaffold.name) %>}}></span>
 * @example
 * function MyCtrl (<%= headlessCamelCase(scaffold.name) %>Filter) {
 *     var filtered = <%= headlessCamelCase(scaffold.name) %>Filter('something');
 * }
 */
main.filter('<%= headlessCamelCase(scaffold.name) %>', function () {

    return function (input) {
        //TODO: insert filter functionality, filters don't have to return string, can be anything
        return input + ' filtered';
    };

});
