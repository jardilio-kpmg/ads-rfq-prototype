var main = require('../main'),
    angular = require('angular');

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
    var name = 'upcService';

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
        model: "",

        /**
         * imageUrl
         */
        imageUrl: ""
    };

    /**
     * www.searchupc.com
     * free service but contains few response fields
     * no cross-domain support
     * @returns {{getData: Function}}
     */
    var searchUpcService = (function () {
        var accessToken = '63D7990D-FAF7-473B-B6F7-E76796C7064F'; // todo : store key
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

                return kHttp.get('//www.searchupc.com/handlers/upcsearch.ashx', {
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
     * no cross-domain support
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

                return kHttp.get('//api.semantics3.com/test/v1/products', {
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
     * api.walmartlabs.com
     * free 5,000 calls per daycro
     * blocker bug: https://developer.walmartlabs.com/forum/read/186437
     * @returns {{getData: Function}}
     */
    var walmartService = (function () {
        var apiKey = 'hcmmsqz3fcsaj9habtsqet5y'; // todo : store key

        return {
            getData: function (upcCode, optionals) {

                return kHttp.jsonp('//api.walmartlabs.com/v1/items', {
                    cache: true,
                    params: angular.extend({
                        apiKey: apiKey,
                        upc: upcCode,
                        format: "json",
                        callback: "JSON_CALLBACK"
                    }, optionals)
                }).success(function (result) {
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
                });
            }
        };
    })();

    /**
     * api.upcdatabase.org
     * free service but contains few response fields
     * no cross-domain support
     * @returns {{getData: Function}}
     */
    var upcDatabaseService = (function () {
        var apiKey = '7a88471889cee487b7fa1ec813399794'; // todo : store key

        return {
            getData: function (upcCode, optionals) {

                /*
                 http result in the form of:
                 var data = {
                 "valid": "true",
                 "number": "077633047375",
                 "itemname": "SUNBEAM TEXAS GAINT",
                 "alias": "",
                 "description": "SUNBEAM TEXAS GAINT",
                 "avg_price": "",
                 "rate_up": 0,
                 "rate_down": 0
                 }; */

                return kHttp.get('//api.upcdatabase.org/json/' + apiKey + '/' + upcCode, {
                    params: angular.extend({}, optionals)
                }).success(function (result) {
                    var products = [];
                    var product = $.extend({}, product);
                    product.name = result.itenname;
                    products.push(product);
                    result.products = products;
                });
            }
        };
    })();

    /**
     * api.v3.factual.com
     * free (unverified) - Up to 100 requests per day
     * @returns {{getData: Function}}
     */
    var factualService = (function () {
        var key = '6tkrAVLSRY503qIo8SMpiPJCJkdqN4GdIJd99co2'; // todo : store key

        return {
            getData: function (upcCode, optionals) {

                // http result in the form of:
                /* var data = {
                 "version": 3,
                 "status": "ok",
                 "response": {
                 "data": [{
                 "avg_price": 4.18,
                 "brand": "Gatorade",
                 "category": "Energy Drinks",
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

                return kHttp.get('//api.v3.factual.com/t/products-cpg', {
                    cache: true,
                    params: angular.extend({
                        KEY: key,
                        filters: {upc: upcCode},
                    }, optionals)
                }).success(function (result) {
                    var products = [];
                    angular.forEach(result.response.data, function (value, key) {
                        var product = $.extend({}, product);
                        product.name = value.product_name;
                        product.brand = value.brand;
                        product.category = value.category;
                        product.imageUrl = value.image_urls && value.image_urls.length ? value.image_urls[0] : "";
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

        // http result in the form of:
        /*
         result : {
         products: [
         {
         brand: "Totino's"
         category: "Frozen Foods"
         imageUrl: "http://media.shopwell.com/gladson/00042800111005_full.jpg"
         name: "Party Pizza Sausage"
         }
         ]
         }
         */

        //return searchUpcService.getData(upcCode);
        //return searchSemanticsService.getData(upcCode);
        //return walmartService.getData(upcCode);
        //return upcDatabaseService.getData(upcCode);
        return factualService.getData(upcCode);
    };

    return self;
});
