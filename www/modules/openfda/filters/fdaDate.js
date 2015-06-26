var main = require('../main');

/**
 * @name openfda.filters.#fdaDate
 * @memberOf openfda.filters
 * @function
 * @param {string} input
 * @return {string}
 * @see http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
 * @example {@lang xml}
 * <span>{{someScopeExpression|fdaDate}}></span>
 * @example
 * function MyCtrl (fdaDateFilter) {
 *     var filtered = fdaDateFilter('something');
 * }
 */
main.filter('fdaDate', function (
    /**ns.$filter */ $filter) {

    'use strict';

    return function (input, format, timezone) {
        var match = /(?:\d{8})/.exec(input), // format of time 20140101
            date;
        if (match && match.length){
            date = new Date(
                parseInt(match[0].substring(0, 4)),
                parseInt(match[0].substring(4, 6)) - 1,
                parseInt(match[0].substring(6, 8)));
        }
        else {
            date = input;
        }
        return $filter('date')(date, format, timezone);
    };
});
