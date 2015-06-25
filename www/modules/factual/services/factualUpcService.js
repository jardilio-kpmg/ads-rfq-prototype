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
     * @param {object=} options
     * @returns  {{success: function, error: function}} HTTP Promise
     */
    self.getData = function (upcCode, options) {

        // http result in the form of:
        /* var data = {
         "version": 3,
         "status": "ok",
         "response": {
         "data": [{
         "avg_price": 4.18,
         "brand": "Gatorade",
         "category": "",
         "ean13": "0052000131512",
         "factual_id": "3e70863a-8887-437c-b329-4a54a40bd07f",
         "image_urls": ["http://c4.soap.com/images/products/p/dcs/dcs-929b_1.jpg", "http://ecx.images-amazon.com/images/I/41fzMs4eLUL._SL500_AA300_.jpg", "http://media.itemmaster.com:80///0/0/0/432/1c256e8a-e65f-4639-8c21-19a1ff84131f.jpg?originalFormat=tif&tkn=914dad50-013c-11e4-acaa-005056ab571e&resize=600x600", "http://media.itemmaster.com:80///0/0/0/432/9ddfa2a3-545a-4606-bf73-cf2bd88afdd9.jpg?originalFormat=png"],
         "manufacturer": "PepsiCo",
         "product_name": "Sports Drink",
         "size": ["32 fl oz"],
         "upc": "052000131512"
         }], "included_rows": 1
         }
         }*/

        return kHttp.get(':server/t/products-cpg', {
            cache: true,
            params: angular.extend({}, factualDefaults, options, {
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
