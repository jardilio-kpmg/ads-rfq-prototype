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
            params: angular.extend(openFdaDefaults, options, {
                barcode: barcode,
                product_type: 'food'// jshint ignore:line
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
        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type::product_type+AND+product_description::keywords', {
            params: angular.extend(openFdaDefaults, options, {
                keywords: keywords.split(' ').join('+'),
                product_type: 'food'// jshint ignore:line
            })
        });
    };

    /**
     * Request the detail information for a particular recall record.
     * @param recallId {string} A string to match against a recall record's key (recall_number).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallById = function(recallId) {
        return kHttp.get(':server/food/enforcement.json?search=status::status+AND+product_type::product_type+AND+recall_number::recall_number', {
            params: angular.extend(openFdaDefaults, {
                recall_number: recallId,// jshint ignore:line
                limit: 1,
                skip: 0,
                product_type: 'food'// jshint ignore:line
            })
        });
    };

    return self;

});
