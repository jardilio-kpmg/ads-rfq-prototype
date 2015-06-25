var main = require('../main');

/**
 * @name kpmg.filters.#truncate
 * @memberOf kpmg.filters
 * @function
 * @param {string} input
 * @return {string}
 * @see http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
 * @example {@lang xml}
 * <span>{{someScopeExpression|truncate}}></span>
 * @example
 * function MyCtrl (truncateFilter) {
 *     var filtered = truncateFilter('something');
 * }
 */
main.filter('truncate', function () {

    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) {
            return input;
        }
        if (chars <= 0) {
            return '';
        }
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            } else {
                while (input.charAt(input.length - 1) === ' ') {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input + '…';
        }
        return input;
    };

});
