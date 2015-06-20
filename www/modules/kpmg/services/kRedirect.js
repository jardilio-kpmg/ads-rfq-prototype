var angular = require('angular'),
    main = require('../main');

require('libs/matchMedia/matchMedia');
require('libs/matchMedia/matchMedia.addListener');

/**
 * @private
 * @type {kSession}
 */
var session;

var $injector;

/**
 * @private
 * @type {ng.$route}
 */
var _route;

var $location;

/**
 * @private
 * @type {ng.$rootScope.Scope}
 */
var $rootScope;

/**
 * A hash of stored media queries with attached listeners for
 * media changes.
 * @private
 * @type {Object}
 */
var mediaQueries = {};

var isFullScreenChanging;

/**
 * Work around to issue with unit tests: https://github.com/angular/angular.js/issues/2717
 * @returns ng.$route
 * @private
 */
function getRoute() {


    if (!_route) {
        _route = $injector.get('$route');
    }
    return _route;
}

/**
 * Registers a listener for a given query if not already and
 * stores the created query in the mediaQueries hash.
 * @param {string} mediaQuery
 * @private
 */
function getMediaQuery(mediaQuery) {


    if (!(mediaQuery in mediaQueries)) {
        var mq = window.matchMedia(mediaQuery);
        mediaQueries[mediaQuery] = mq;
        mq.addListener(function () {
            //re-evaluate the current route for mediaQuery change
            //prevent triggers from fullscreen change and softkeyboard presentation
            var activeElementTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            var isKeyboardActive = activeElementTag === 'input' || activeElementTag === 'textarea';
            if (!isFullScreenChanging && !isKeyboardActive && !$rootScope.$broadcast('$mediaQueryRedirectRequested').defaultPrevented) {
                getRoute().reload();
                $rootScope.$digest();
            }
        });
    }
    return mediaQueries[mediaQuery];
}

/**
 * @class kpmgAngular.services.kRedirectProvider
 * @extends kpmgAngular.services.kRedirect
 */

/**
 * The provider simply extends the functionality of the service
 * so as you will likely need access to this instance both
 * in config and run functions.
 * @class kpmgAngular.services.kRedirect
 * @see https://docs.angularjs.org/guide/services
 * @example
 * angular.module('myapp').config(function ($routeProvider, kRedirectProvider) {
 *      $routeProvider.when('/path/to/route', {
 *          templateUrl: 'myview.html',
 *          controller: MyController,
 *          redirectTo: kRedirectProvider.ifNotAuthenticated('/path/to/login', true)
 *      });
 * }
 */
main.provider('kRedirect', function () {



    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'kRedirect';

    var redirect = {

        /**
         * Provides ability to chain together multiple route redirect conditions. The
         * first one that returns a redirected page wins.
         *
         * @name kpmgAngular.services.kRedirect#toFirstMatch
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {...Function} func One or more redirect to functions to process
         * @returns Function
         */
        toFirstMatch: function () {
            var functions = arguments;
            return function (parameters, path, search) {
                var i, redirect, func;
                for (i = 0; i < functions.length; i++) {
                    func = functions[i];
                    redirect = func(parameters, path, search);
                    if (redirect !== path) {
                        return redirect;
                    }
                }
                return path;
            };
        },

        /**
         * Will redirect a route request if condition is a
         * "truthy" expression. In that case, will redirect to
         * specified "toPage" and opptionally append a refer
         * query parameter if "refer" is true.
         *
         * @name kpmgAngular.services.kRedirect#when
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {Boolean|Function} condition
         * @param {String} toPage
         * @param {Boolean} refer
         * @returns Function
         */
        when: function (condition, toPage, refer) {
            return function (parameters, path) {
                var isValid = typeof(condition) === 'function' ? condition() : condition;
                path = $location.url();
                return isValid ? toPage + (refer ? '?refer=' + escape(path) : '') : path;
            };
        },

        /**
         * Will redirect a route request if condition isn't a
         * "truthy" expression. In that case, will redirect to
         * specified "toPage" and opptionally append a refer
         * query parameter if "refer" is true.
         *
         * @name kpmgAngular.services.kRedirect#ifNot
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {Boolean|Function} condition
         * @param {String} toPage
         * @param {Boolean} refer
         * @returns {Function}
         */
        ifNot: function (condition, toPage, refer) {
            return function (parameters, path) {
                var isValid = typeof(condition) === 'function' ? condition() : condition;
                path = $location.url();
                return isValid ? path : toPage + (refer ? '?refer=' + escape(path) : '');
            };
        },

        /**
         * Will redirect to specified page if there
         * is currently no authenticated session.
         * @name kpmgAngular.services.kRedirect#ifNotAuthenticated
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {String} toPage
         * @param {Boolean} refer
         * @returns {Function}
         * @see kpmgAngular.services.KSession
         */
        ifNotAuthenticated: function (toPage, refer) {
            return redirect.ifNot(
                function () {
                    return session && session.isAuthenticated();
                },
                toPage,
                refer
            );
        },

        /**
         * Will redirect to specified page if there
         * is currently an authenticated session.
         * @name kpmgAngular.services.kRedirect#ifAuthenticated
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {String} toPage
         * @param {Boolean} refer
         * @returns {Function}
         * @see kpmgAngular.services.KSession
         */
        ifAuthenticated: function (toPage, refer) {
            return redirect.when(
                function () {
                    return session && session.isAuthenticated();
                },
                toPage,
                refer
            );
        },

        /**
         * Will watch for a given mediaQuery to be validated, if true,
         * then will redirect the view to the given page. This can be used
         * as an extension or alternative to traditional responsive design
         * to offer a completely different view template.
         * @name kpmgAngular.services.kRedirect#ifMatchMedia
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {String} mediaQuery CSS media query
         * @param {String} toPage
         * @param {Boolean} [refer]
         * @returns {Function}
         */
        ifMatchMedia: function (mediaQuery, toPage, refer) {
            mediaQuery = getMediaQuery(mediaQuery);
            return redirect.when(
                function () {
                    return mediaQuery.matches;
                },
                toPage,
                refer
            );
        },

        /**
         * Will watch for a given mediaQuery to be validated, if false,
         * then will redirect the view to the given page. This can be used
         * as an extension or alternative to traditional responsive design
         * to offer a completely different view template.
         * @name kpmgAngular.services.kRedirect#ifNotMatchMedia
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @param {String} mediaQuery CSS media query
         * @param {String} toPage
         * @param {Boolean} [refer]
         * @returns {Function}
         */
        ifNotMatchMedia: function (mediaQuery, toPage, refer) {
            mediaQuery = getMediaQuery(mediaQuery);
            return redirect.when(
                function () {
                    return !mediaQuery.matches;
                },
                toPage,
                refer
            );
        },

        /**
         * @name kpmgAngular.services.kRedirect#getName
         * @methodOf kpmgAngular.services.kRedirect
         * @function
         * @returns {string}
         */
        getName: function () {
            return name;
        }
    };

    angular.extend(self, redirect, {$get: function () {
        return redirect;
    }});

    return self;

});

main.run(['$injector', function (_$injector) {


    $injector = _$injector;
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    session = $injector.get('kSession');
    $rootScope.$watch(
        function () {
            return session.isAuthenticated();
        },
        function (isAuthenticated) {
            var refer = $location.search().refer;
            if (isAuthenticated && refer) {
                $location.search('refer', null);
                $location.url(refer);
                $location.replace();
            }
            else {
                //re-evaluate the current route for permissions change
                getRoute().reload();
            }
        }
    );

    angular.element(window).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function () {
        //ignore the next redirect request from screen size change when entering and exiting fullscreen
        isFullScreenChanging = true;
        setTimeout(function () {
            isFullScreenChanging = false;
        }, 1000);
    });
}]);
