var main = require('../main'),
    angular = require('angular');

/**
 * @class recalls.services.recallSearchService
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(recallSearchService) {
 *      recallSearchService.getRecallsByBarcode('111111111111', 0)
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('recallSearchService', function (/**kpmgAngular.services.kHttp*/ kHttp) {

    var self = this,
        fdaApiBase = 'https://api.fda.gov/food/enforcement.json',
        fdaApiKey = 'CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic',
        defaultResultsLimit = 30,
        defaultRecallStatus = 'ongoing',
        defaultProductType = 'food';

    /**
     * Search for recall records based on a UPC code.
     * @param barcode {string} A UPC barcode string to search for. The string will be matched against code_info.
     * @param recordToStartWith {number} Of the total number of results, which record should be listed first (e.g. 15 would give you 15 - 45 based on the default result limit).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallsByBarcode = function (barcode, recordToStartWith) {
        if(!recordToStartWith) {
            recordToStartWith = 0;
        }
        return kHttp.get(fdaApiBase + '?api_key=:apiKey&limit=:limit&skip=:skip&search=status::status+AND+product_type::type+AND+code_info::barcode', {
            params: {
                apiKey: fdaApiKey,
                limit: defaultResultsLimit,
                skip: recordToStartWith,
                status: defaultRecallStatus,
                type: defaultProductType,
                barcode: barcode
            }
        });
    };

    /**
     * Search for recall records that meet one or more supplied keywords.
     * @param keywords {array} A list of search strings to search by. The keywords will be matched against product_description.
     * @param recordToStartWith {number} Of the total number of results, which record should be listed first (e.g. 15 would give you 15 - 45 based on the default result limit).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallsByKeyword = function (keywords, recordToStartWith) {
        var combinedKeywords, escapedKeyword;

        if(!recordToStartWith) {
            recordToStartWith = 0;
        }
        //Break apart the array of search keywords into one string.
        //See https://open.fda.gov/api/reference/#query-syntax for more info
        if(keywords && angular.isArray(keywords)) {
            angular.forEach(keywords, function(keyword) {
                escapedKeyword = keyword.split(' ').join('+');
                if(!combinedKeywords) {
                    combinedKeywords = escapedKeyword;
                } else {
                    combinedKeywords += '+' + escapedKeyword;
                }
            });

            combinedKeywords = '+AND+product_description:' + combinedKeywords;
        }

        return kHttp.get(fdaApiBase + '?api_key=:apiKey&limit=:limit&skip=:skip&search=status::status+AND+product_type::type' + combinedKeywords, {
            params: {
                apiKey: fdaApiKey,
                limit: defaultResultsLimit,
                skip: recordToStartWith,
                status: defaultRecallStatus,
                type: defaultProductType
            }
        });
    };

    /**
     * Gets additional product data bound to the upc barcode.
     * @param barcode {string} A UPC barcode string to search for. The string will be matched against code_info.
     * @returns {{success: Function, error: Function}}
     */
    self.getBarcodeData = function(barcode) {
        //TODO: The call to getRecallsByBarcode is temporary. Call new service when it is ready.
        return self.getRecallsByBarcode(barcode, 0);
    };

    /**
     * Request the detail information for a particular recall record.
     * @param recallId {string} A string to match against a recall record's key (recall_number).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallById = function(recallId) {
        return kHttp.get(fdaApiBase + '?api_key=:apiKey&limit=:limit&skip=:skip&search=status::status+AND+product_type::type&search=recall_number::recallId', {
            params: {
                apiKey: fdaApiKey,
                limit: 1,
                skip: 0,
                status: defaultRecallStatus,
                type: defaultProductType,
                recallId: recallId
            }
        });
    };

    return self;

});
