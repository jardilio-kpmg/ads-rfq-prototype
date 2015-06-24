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
main.service('foodEnforcementService', function (
    /**kpmgAngular.services.kHttp*/ kHttp,
    /**openfda.openFdaConfig*/ openFdaConfig) {

    'use strict';

    var self = this;

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

        /*Setup of api_key and search query parameters are intended here for two reasons:
        * 1) According to documentation, the api_key param must come before other params.
        * 2) The search param items are separated  by '+AND+' and the openFDA API is refusing
        * the requests when they are url encoded. Passing search as a param object property is causing
        * the values to get encoded so I'm hard-coding them as part of the url.*/
        return kHttp.get(openFdaConfig.apiBase + '?api_key=' + openFdaConfig.apiKey + '&search=status:'  + openFdaConfig.defaultRecallStatus + '+AND+product_type:' + openFdaConfig.defaultProductType + '+AND+code_info:' + barcode, {
            params: {
                limit: openFdaConfig.defaultResultsLimit,
                skip: recordToStartWith
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

        /*Setup of api_key and search query parameters are intended here for two reasons:
         * 1) According to documentation, the api_key param must come before other params.
         * 2) The search param items are separated  by '+AND+' and the openFDA API is refusing
         * the requests when they are url encoded. Passing search as a param object property is causing
         * the values to get encoded so I'm hard-coding them as part of the url.*/
        return kHttp.get(openFdaConfig.apiBase + '?api_key=' + openFdaConfig.apiKey + '&search=status:'  + openFdaConfig.defaultRecallStatus + '+AND+product_type:' + openFdaConfig.defaultProductType + combinedKeywords, {
            params: {
                limit: openFdaConfig.defaultResultsLimit,
                skip: recordToStartWith
            }
        });
    };

    /**
     * Request the detail information for a particular recall record.
     * @param recallId {string} A string to match against a recall record's key (recall_number).
     * @returns {{success: Function, error: Function}}
     */
    self.getRecallById = function(recallId) {

        // Todo: Bug in api when using recall_number.

        /*Setup of api_key and search query parameters are intended here for two reasons:
         * 1) According to documentation, the api_key param must come before other params.
         * 2) The search param items are separated  by '+AND+' and the openFDA API is refusing
         * the requests when they are url encoded. Passing search as a param object property is causing
         * the values to get encoded so I'm hard-coding them as part of the url.*/
        return kHttp.get(openFdaConfig.apiBase + '?api_key=' + openFdaConfig.apiKey + '&search=status:'  + openFdaConfig.defaultRecallStatus + '+AND+product_type:' + openFdaConfig.defaultProductType + '+AND+recall_number:' + recallId, {
            params: {
                limit: 1,
                skip: 0
            }
        });
    };

    return self;

});
