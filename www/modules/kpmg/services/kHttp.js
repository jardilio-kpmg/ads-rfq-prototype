var angular = require('angular'),
    main = require('../main');

/**
 * A wrapper function for ng.$http to enhance it
 * with additional functionality including URL
 * aliasing (for different server environments) and
 * URL parameterizing (similar to ngResource.$resource).
 * <br/><br/>
 * Given a urls of '/path/to/:username.json', if property
 * 'username' exists in config.params, then ':username' will
 * be replaced with that parameter value in the path and the parameter
 * will be removed from config.params so its not added
 * as a separate get parameter (ie ?username=john.doe).
 * <br/><br/>
 * Default parameters may also be stored in http.defaults directly,
 * such as http.defaults.username = 'john.doe'. These parameters
 * unlike config.params will not be deleted and are generally used
 * for global configuration options, such as server path for a
 * given environment.
 *
 * @see http://docs.angularjs.org/api/ng.$http
 * @class kpmgAngular.services.kHttp
 * @example
 *
 * angular.module('myapp').config(function (kHttpProvider) {
 *      kHttpProvider.defaults.server = 'http://www.mydomain.com';
 * });
 *
 * angular.module('myapp').controller('MyController', function (kHttp) {
 *      function getUser(username) {
 *          kHttp.get(':server/api/users/:username.json', {params: {username: 'jdoe'}});
 *      }
 * });
 */
main.service('kHttp', function ($http) {



    function self(config) {
        config.url = buildUrlPath(config.url, config.params, true);
        config.url = buildUrlPath(config.url, self.defaults, false);
        return $http(config);
    }

    function buildUrlPath(url, params, remove) {
        var param, key;
        for (param in params) {
            key = ':' + param;
            if (url.indexOf(key) !== -1) {
                url = url.split(key).join(params[param]);
                if (remove) {
                    delete params[param];
                }
            }
        }
        return url;
    }

    function createShortMethods() {
        angular.forEach(arguments, function (name) {
            self[name] = function (url, config) {
                return self(angular.extend(config || {}, {
                    method: name,
                    url: url
                }));
            };
        });
    }


    function createShortMethodsWithData() {
        angular.forEach(arguments, function (name) {
            self[name] = function (url, data, config) {
                return self(angular.extend(config || {}, {
                    method: name,
                    url: url,
                    data: data
                }));
            };
        });
    }

    /**
     * @name kpmgAngular.services.kHttp#delete
     * @methodOf kpmgAngular.services.kHttp
     * @function
     *
     * @description
     * Shortcut method to perform `DELETE` request
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {{success: function, error: function}} Promise Object
     */

    /**
     * @name kpmgAngular.services.kHttp#head
     * @methodOf kpmgAngular.services.kHttp
     * @function
     *
     * @description
     * Shortcut method to perform `HEAD` request
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {{success: function, error: function}} Promise Object
     */

    /**
     * @name kpmgAngular.services.kHttp#jsonp
     * @methodOf kpmgAngular.services.kHttp
     * @function
     *
     * @description
     * Shortcut method to perform `JSONP` request
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request.
     *                     Should contain `JSON_CALLBACK` string.
     * @param {Object=} config Optional configuration object
     * @returns {{success: function, error: function}} Promise Object
     */
    createShortMethods('get', 'delete', 'head', 'jsonp');

    /**
     * @name kpmgAngular.services.kHttp#delete
     * @methodOf kpmgAngular.services.post
     * @function
     *
     * @description
     * Shortcut method to perform `POST` request
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {{success: function, error: function}} Promise Object
     */

    /**
     * @name kpmgAngular.services.kHttp#get
     * @methodOf kpmgAngular.services.kHttp
     * @function
     *
     * @description
     * Shortcut method to perform `PUT` request
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {{success: function, error: function}} Promise Object
     */
    createShortMethodsWithData('post', 'put');

    /**
     * @name kpmgAngular.services.kHttp#defaults
     * @propertyOf kpmgAngular.services.kHttp
     *
     * @description
     * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of
     * default headers as well as request and response transformations.
     * <br/><br/>
     * You can place default URL path parameters here that will be replaced in the URL
     * path string automatically.
     * <br/><br/>
     */
    self.defaults = angular.extend( $http.defaults || {}, self.defaults );

    /**
     * @private
     * @type {string}
     */
    var name = 'kHttp';

    /**
     * @name kpmgAngular.services.kHttp#getName
     * @methodOf kpmgAngular.services.kHttp
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    return self;

});
