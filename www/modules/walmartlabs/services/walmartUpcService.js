var main = require('../main'),
    angular = require('angular');

/**
 * @class walmartlabs.services.walmartUpcService
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(walmartUpcService) {
 *      walmartUpcService.getData(input1, input2, {option1: 'option1'})
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('walmartUpcService', function (
    /**kpmgAngular.services.kHttp*/ kHttp,
    /**walmartlabs.walmartlabsDefaults*/ walmartlabsDefaults) {

    'use strict';

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'walmartUpcService';

    /**
     * @name walmartlabs.services.walmartUpcService#getName
     * @methodOf walmartlabs.services.walmartUpcService
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * @name walmartlabs.services.walmartUpcService#getData
     * @methodOf walmartlabs.services.walmartUpcService
     * @function
     * @param {string} upcCode
     * @param {object=} options
     * @returns  {{success: function, error: function}} HTTP Promise
     */
    self.getData = function (upcCode, options) {

        return kHttp.jsonp(':server/v1/items', {
            cache: true,
            params: angular.extend({}, walmartlabsDefaults, options, {
                upc: upcCode,
                format: 'json',
                callback: "JSON_CALLBACK"
            })
        });
    };

    /**
     * Get Products
     * @param result
     */
    self.getProducts = function(result){
        var products = [];
        angular.forEach(result.items, function (value, key) {
            var product = $.extend({}, product);
            product.name = value.name;
            product.brand = value.brandName;
            product.category = value.categoryPath;
            product.imageUrl = value.largeImage;
            products.push(product);
        });
        result.products = products;
    };

    return self;

});
