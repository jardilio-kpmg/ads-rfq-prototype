var main = require('../main');

require('libs/base64/base64');

/**
 * A hook to provide Basic Authentication to
 * the $http and kHttp services.
 * @class kpmgAngular.services.kAuth
 * @see https://docs.angularjs.org/guide/services
 * @example
 * function MyCtrl(kAuth) {
 *      kAuth.getName();
 * }
 */
main.service('kAuth', function ($http, kHttp, $cookieStore) {



    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'kAuth';

    /**
     * @name kpmgAngular.services.kAuth#getName
     * @methodOf kpmgAngular.services.kAuth
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * Returns an encoded Authorization header value based on username and value.
     * @name kpmgAngular.services.kAuth#encode
     * @methodOf kpmgAngular.services.kAuth
     * @function
     * @param username
     * @param password
     * @returns {string}
     */
    self.encode = function (username, password) {
        return 'Basic ' + window.btoa(username + ':' + password);
    };

    /**
     * Creates an Authorization header in $http.default.headers.common.Authorization
     * @name kpmgAngular.services.kAuth#setAuthentication
     * @methodOf kpmgAngular.services.kAuth
     * @function
     * @param username
     * @param password
     */
    self.setAuthentication = function (username, password) {
        $http.defaults.headers.common.Authorization = kHttp.defaults.headers.common.Authorization = self.encode(username,password);
        $cookieStore.put('kAuth', $http.defaults.headers.common.Authorization);
    };

    /**
     * Returns the current authentication header value, if any.
     * @name kpmgAngular.services.kAuth#getAuthentication
     * @methodOf kpmgAngular.services.kAuth
     * @function
     * @param username
     * @param password
     * @returns {string}
     */
    self.getAuthentication = function () {
        return $cookieStore.get('kAuth');
    };

    /**
     * Removes an Authorization header from $http.default.headers.common.Authorization
     * @name kpmgAngular.services.kAuth#clearAuthentication
     * @methodOf kpmgAngular.services.kAuth
     * @function
     */
    self.clearAuthentication = function () {
        delete $http.defaults.headers.common.Authorization;
        delete kHttp.defaults.headers.common.Authorization;
        $cookieStore.remove('kAuth');
    };

    if (self.getAuthentication()) {
        $http.defaults.headers.common.Authorization = kHttp.defaults.headers.common.Authorization = self.getAuthentication();
    }

    return self;

});
