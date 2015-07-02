var main = require('../main'),
    angular = require('angular');

/**
 * @class openfda.services.foodEnforcementService
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(foodEnforcementService) {
 *      foodEnforcementService.getRecallsByBarcode('111111111111', 0)
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('foodEnforcementService', function (/**kpmgAngular.services.kHttp*/ kHttp, /**openfda.openFdaDefaults*/ openFdaDefaults) {

    var self = this;

    /**
     * Search for recall records based on a UPC code.
     * @param barcode {string} A UPC barcode string to search for. The string will be matched against code_info.
     * @param {object} options
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallsByBarcode = function (barcode, options) {
        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type:food+AND+code_info::barcode', {
            cache: true,
            params: angular.extend({}, openFdaDefaults, options, {
                barcode: barcode
            })
        });
    };

    /**
     * Search for recall records that meet one or more supplied keywords.
     * @param {string} keywords A list of search strings to search by. The keywords will be matched against product_description.
     * @param {object} options
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallsByKeyword = function (keywords, options) {
        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type:food+AND+product_description::keywords', {
            cache: true,
            params: angular.extend({}, openFdaDefaults, options, {
                keywords: keywords.split(' ').join('+')
            })
        });
    };

    /**
     * Request the detail information for a particular recall record.
     * @param recallId {string} A string to match against a recall record's key (recall_number).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallById = function (id) {
        // @id needs to be _id
        return kHttp.get(':server/food/enforcement.json?search=_id::id', {
            cache: true,
            params: angular.extend({}, openFdaDefaults, {
                id: id,// jshint ignore:line
                limit: 1,
                status: null
            })
        });
    };

    /**
     * Request the classification count details for a group of recall records
     * that satisfy the barcode search information.
     * @param barcode {string} A UPC barcode string to search for. The string will be matched against code_info.
     * @param startDate {string} A date in this format: YYYY-MM-DD
     * @param endDate {string} A date in this format: YYYY-MM-DD
     * @param {object} options
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallTrendsByBarcode = function(barcode, startDate, endDate, options) {
        var dateRange = startDate && endDate ? '+AND+report_date:[' + startDate + '+TO+' + endDate + ']': '';

        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type:food+AND+code_info::barcode' + dateRange, {
            cache: true,
            params: angular.extend({}, openFdaDefaults, options, {
                barcode: barcode,
                count: 'classification'
            })
        });
    };

    /**
     * Request the classification count details for a group of recall records
     * that satisfy the keywords search information.
     * @param barcode {string} A UPC barcode string to search for. The string will be matched against code_info.
     * @param startDate {string} A date in this format: YYYY-MM-DD
     * @param endDate {string} A date in this format: YYYY-MM-DD
     * @param {object} options
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallTrendsByKeyword = function(keywords, startDate, endDate, options) {
        var dateRange = startDate && endDate ? '+AND+report_date:[' + startDate + '+TO+' + endDate + ']': '';

        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type:food+AND+product_description::keywords' + dateRange, {
            cache: true,
            params: angular.extend({}, openFdaDefaults, options, {
                keywords: keywords.split(' ').join('+'),
                count: 'classification'
            })
        });
    };

    /**
     * Extracts the upc from the recall
     * @param recall
     * @returns {*}
     */
    self.extractUpc = function (recall) {
        // clear empty spaces
        var code = recall.code_info + recall.product_description;// jshint ignore:line
        code = code.replace(/\s+|\s+/gm, '').replace(/-+/gm, ''); // clear -
        var match = /(?:\d{13}|\d{12}|\d{11}|\d{10}|\d{9}|\d{8})/.exec(code); // search upc
        var upc = '';
        if (match && match.length) {
            upc = match[0];
        }

        return upc;
    };

    return self;

});
