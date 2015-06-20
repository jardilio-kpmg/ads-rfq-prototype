/**
 * @module <%= scaffold.module %>/<%= scaffold.name %>
 * @example
 * var <%= headlessCamelCase(scaffold.name) %> = require('modules/<%= scaffold.module %>/<%= scaffold.name %>');
 */
module.exports = {

    /**
     * @returns {string}
     */
    getName: function () {
        return '<%= scaffold.name %>';
    }

};
