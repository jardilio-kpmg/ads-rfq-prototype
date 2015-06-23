var main = require('../main');

/**
 * @class server.services.upcService
 * @see kpmgAngular.services.kHttp
 * @see https://docs.angularjs.org/guide/services
 * @see http://docs.angularjs.org/api/ngResource.$resource
 * @example
 * function MyCtrl(upcService) {
 *      upcService.getData(input1, input2, {option1: 'option1'})
 *          .success(function (result) {
 *
 *          })
 *          .error(function (error) {
 *
 *          });
 * }
 */
main.service('upcService', function (/**kpmgAngular.services.kHttp*/ kHttp) {

    'use strict';

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'upc';

    /**
     * Product
     * @returns {product}
     * @constructor
     */
    var product = {

        /**
         * name
         * @type {string}
         */
        name: "",

        /**
         * siteName
         * @type {string}
         */
        siteName: "",

        /**
         * brand
         * @type {string}
         */
        brand: "",

        /**
         * category
         * @type {string}
         */
        category: "",

        /**
         * manufacturer
         * @type {string}
         */
        manufacturer: "",

        /**
         * model
         * @type {string}
         */
        model: ""
    };

    /**
     * www.searchupc.com
     * free service but contains few response fields
     * @returns {{getData: Function}}
     */
    var searchUpcService = (function () {
        var accessToken = '63D7990D-FAF7-473B-B6F7-E76796C7064F'; // todo : store token
        var jsonRequestType = 3;

        return {
            getData: function (upcCode, optionals) {

                /*
                 http result in the form of:
                 {
                 "0": {
                 "productname": "Totinos Sausage Party Pizza, 10.8 Ounce -- 12 per case.",
                 "imageurl": "http://ecx.images-amazon.com/images/I/31wadQVMcyL._SL160_.jpg",
                 "producturl": "",
                 "price": "28.35",
                 "currency": "USD",
                 "saleprice": "",
                 "storename": "N/A"
                 }
                 }
                 */

                return kHttp.get('http://www.searchupc.com/handlers/upcsearch.ashx', {
                    params: angular.extend({
                        request_type: jsonRequestType,
                        access_token: accessToken,
                        upc: upcCode
                    }, optionals)
                }).success(function (result) {
                    var products = [];
                    angular.forEach(result, function (value, key) {
                        var product = $.extend({}, product);
                        product.name = value.productname;
                        product.siteName = value.storename;
                        products.push(product);
                    });
                    result.products = products;
                });
            }
        };
    })();

    /**
     * www.semantics3.com
     * free plan that allows for upto 1000 queries a day, which theoretically allows you to track upto 10,000 products
     * @type {{getData}}
     */
    var searchSemanticsService = (function () {
        var apiKey = 'SEM316069E234759F3C8613CF8E676E05704'; // todo : store key

        return {
            getData: function (upcCode, optionals) {
                // refer to http://docs.semantics3.com/v1.0/docs/responses
                var q = {
                    "upc": upcCode,
                    "fields": [
                        "sem3_id",
                        "name",
                        "sitedetails",
                        "brand",
                        "cat_id",
                        "category",
                        "description",
                        "ean",
                        "features",
                        "gtins",
                        "geo",
                        "height",
                        "length",
                        "manufacturer",
                        "model",
                        "mpn",
                        "price",
                        "size",
                        "variation_id",
                        "weight",
                        "width"
                    ]
                };

                /*
                 http result in the form of:
                 {
                 "total_results_count": 1,
                 "code": "OK",
                 "offset": 0,
                 "results_count": 1,
                 "results": [
                 {
                 "sem3_id": "2MMxsP9q0SgEu4wSK4s4eq",
                 "name": "Totino's Sausage Party Pizza, 10.8 oz",
                 "sitedetails": [
                 {
                 "name": "walmart.com",
                 "recentoffers_count": 0,
                 "url": "http://www.walmart.com/ip/10813475",
                 "sku": "10813475",
                 "latestoffers": []
                 }
                 ],
                 "brand": "Totino's",
                 "category": "Meat & Poultry",
                 "ean": "0042800111005",
                 "gtins": [
                 "00042800111005"
                 ],
                 "geo": [
                 "usa"
                 ],
                 "manufacturer": "General Mills",
                 "model": "11100",
                 "weight": "306174.85"
                 }
                 ]
                 }
                 */

                return kHttp.get('https://api.semantics3.com/test/v1/products', {
                    params: angular.extend({
                        q: q
                    }, optionals),
                    headers: {
                        api_key: apiKey
                    }
                }).success(function (result) {
                    var products = [];
                    angular.forEach(result.results, function (value, key) {
                        var product = $.extend({}, product);
                        product.name = value.name;
                        product.siteName = value.sitedetails && value.sitedetails.length ? value.sitedetails[0].name : "";
                        product.brand = value.brand;
                        product.category = value.category;
                        product.manufacturer = value.manufacturer;
                        product.model = value.model;
                        products.push(product);
                    });
                    result.products = products;
                });
            }
        };
    })();

    /**
     * @name server.services.upc#getName
     * @methodOf server.services.upc
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * @name server.services.upc#getData
     * @methodOf server.services.upc
     * @param {string} upcCode
     * @param {object=} optionals
     * @returns {{success: function, error: function}} HTTP Promise
     */
    self.getData = function (upcCode, optionals) {
        /*
         return kHttp.get('/server/upc/data', {
         params: angular.extend({
         required1: required1,
         required2: required2
         }, optionals)
         });
         */

        var result = searchSemanticsService.getData(upcCode);
        if (result.products && result.products.length) {
            return result;
        } else {
            result = searchUpcService.getData(upcCode);
            return result;
        }
    };

    return self;
});
