var main = require('../main'),
    angular = require('angular');

/**
 * @class factual.services.factualUpcService
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(factualUpcService) {
 *      factualUpcService.getData(input1, input2, {option1: 'option1'})
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('factualUpcService', function (
    /**kpmgAngular.services.kHttp*/ kHttp,
    /**factual.factualDefaults*/ factualDefaults) {

    'use strict';

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'factualUpcService';

    /**
     * @name factual.services.factualUpcService#getName
     * @methodOf factual.services.factualUpcService
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * @name factual.services.factualUpcService#getData
     * @methodOf factual.services.factualUpcService
     * @function
     * @param {string} upcCode
     * @returns  {{success: function, error: function}} HTTP Promise
     */
    self.getData = function (upcCode) {
        return kHttp.get(':server/t/products-cpg', {
            cache: true,
            params: angular.extend({}, factualDefaults, {
                filters: {upc: upcCode ? upcCode : '$blank'}
            })
        });
    };

    /**
     * Gets products
     * @param result
     * @returns {Array}
     */
    self.getProducts = function(result) {
        var products = [];
        angular.forEach(result.response.data, function (value) {
            var product = {};
            product.name = value.product_name; // jshint ignore:line
            product.brand = value.brand;
            product.category = value.category;
            product.imageUrl = value.image_urls && value.image_urls.length ? value.image_urls[0] : ''; // jshint ignore:line
            products.push(product);
        });
        return products;
    };

    return self;

});
