var angular = require('angular'),
    main = require('../main');

/**
 * Contains all user session related data. Data is persisted to
 * disk using cookie storage and is automatically retrieved on
 * the users next session for the application.
 * <br/><br/>
 * This class services as a central location for managing
 * authentication state of the application so it can be used
 * in conjunction with other services, such as the redirect
 * service to watch when authentication changes.
 * @class kpmgAngular.services.kSession
 * @see https://docs.angularjs.org/guide/services
 * @example
 * angular.module('myapp').controller('LoginController', function (kHttp, kSession) {
 *
 *      var self = this,
 *          session = kSession.data();
 *
 *      self.username = session.currentUser && session.currentUser.username;
 *
 *      self.password = '';
 *
 *      function login() {
 *          kHttp.post('authentication', {
 *              username: self.username,
 *              password: self.password
 *          }).success(function (result) {
 *              //remember this for next time user returns to application
 *              kSession.data({
 *                  currentUser: result;
 *              });
 *              kSession.isAuthenticated(true);
 *          });
 *      }
 *
 * });
 */
main.service('kSession', function ($cookieStore) {



    /**
     * @private
     * @type {string}
     */
    var name = 'kSession';

    var isAuthenticated = false;
    var data = null;
    var key = 'cySession';

    if (window.localStorage) {
        //override $cookieStore and use localStorage instead with same interface
        $cookieStore = {
            get: function (key) {
                return angular.fromJson(window.localStorage[key]);
            },
            put: function (key, value) {
                window.localStorage[key] = angular.toJson(value);
            },
            remove: function (key) {
                delete window.localStorage[key];
            }
        };
    }

    var session = {
        /**
         * Saves and persists the current session data back to
         * users application storage area for retrieval on next
         * load of the application. This method is automatically
         * called when setting a value to session data via
         * session.data({});
         *
         * @name kpmgAngular.services.kSession#save
         * @methodOf kpmgAngular.services.kSession
         * @function
         */
        save: function () {
            $cookieStore.put(key, data);
        },

        /**
         * Destroys all persisted current session data from the
         * disk and locally. Also will set isAuthenticated to false
         * thus triggering the change method to be executed.
         *
         * @name kpmgAngular.services.kSession#reset
         * @methodOf kpmgAngular.services.kSession
         * @function
         */
        reset: function () {
            isAuthenticated = false;
            data = null;
            $cookieStore.remove(key);
        },

        /**
         * Getter/setter function for determining if a session is
         * currently authenticated or not.
         *
         * @name kpmgAngular.services.kSession#isAuthenticated
         * @methodOf kpmgAngular.services.kSession
         * @function
         * @param {boolean=} [value] Optional, use to set a new value for isAuthenticated
         * @returns {boolean} True is session is authenticated
         */
        isAuthenticated: function (value) {
            if (arguments.length === 1) {
                isAuthenticated = value;
            }

            return isAuthenticated;
        },

        /**
         * Getter/setter function for session peristed data in the application.
         *
         * @name kpmgAngular.services.kSession#data
         * @methodOf kpmgAngular.services.kSession
         * @function
         * @param {*=} [value] Optional, use to set a new value for data
         * @returns {*} The previously saved session data, if any.
         */
        data: function (value) {
            if (arguments.length === 1) {
                data = value || {};
                session.save();
            }
            else if (!data) {
                data = $cookieStore.get(key) || (function () {
                    var _data = {};
                    $cookieStore.put(key, _data);
                    return _data;
                })();
            }

            return data;
        },

        /**
         * @name kpmgAngular.services.kSession#getName
         * @methodOf kpmgAngular.services.kSession
         * @function
         * @returns {string}
         */
        getName: function () {
            return name;
        }
    };

    window.onbeforeunload = function () {
        session.save();
    };

    return session;

});
