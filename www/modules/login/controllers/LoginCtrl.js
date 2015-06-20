var main = require('../main');

/**
 * @class login.controllers.LoginCtrl
 * @see http://docs.angularjs.org/guide/dev_guide.mvc.understanding_controller
 * @example {@lang xml}
 * <div ng-controller="LoginCtrl as ctrl">
 *      <h1>{{ctrl.getName()}}</h1>
 * </div>
 * @example
 * angular.module('login').directive('mydirective', function () {
 *      return {
 *          controller: 'LoginCtrl',
 *          require: ['mydirective'],
 *          link: function ($scope, $elem, $attr, controllers) {
 *              var loginCtrl = controllers[0];
 *              loginCtrl.getName();
 *          }
 *      };
 * });
 */
main.controller('LoginCtrl', function (
    /**kpmgAngular.services.kSession*/ kSession,
    /**kpmgAngular.services.kAuth*/ kAuth,
    $routeParams,
    $location,
    /**api.v1.Login*/ Login) {

    var self = this;

    /**
     * @private
     * @type {string}
     */
    var name = 'LoginCtrl';

    /**
     * @name login.controllers.LoginCtrl#getName
     * @methodOf login.controllers.LoginCtrl
     * @function
     * @returns {string}
     */
    self.getName = function () {
        return name;
    };

    /**
     * Username to authenticate with
     * @name login.controllers.LoginCtrl#username
     * @propertyOf login.controllers.LoginCtrl
     * @type {string}
     */
    self.username = '';

    /**
     * Password to authenticate with
     * @name login.controllers.LoginCtrl#password
     * @propertyOf login.controllers.LoginCtrl
     * @type {string}
     */
    self.password = '';

    /**
     * Determines if we can currently login (we have a
     * username and password).
     * @name login.controllers.LoginCtrl#canlogin
     * @methodOf login.controllers.LoginCtrl
     * @function
     * @returns {boolean}
     */
    self.canlogin = function () {
        return !!(self.username && self.password && !loggingIn);
    };

    var loggingIn = false;

    /**
     * Will login user into the application, if the
     * current state allows it. If authenticates, will
     * redirect to the refering page (query param 'refer').
     *
     * @name login.controllers.LoginCtrl#canlogin
     * @methodOf login.controllers.LoginCtrl
     * @function
     */
    self.login = function () {
        //TODO: authenticate against your services, currently this is using api.v1.mock.js
        if (self.canlogin()) {
            var login = new Login();
            login.username = self.username;
            login.password = self.password;
            login.$create().then(
                function(result) {
                    loggingIn = false;
                    //this will set authorization headers on all $http requests
                    kAuth.setAuthentication(result.token);
                    //this will update any unauthenticated redirects for views
                    kSession.isAuthenticated(true);
                    //now redirect to the view we originally came from
                    $location.url($routeParams.refer || '/');
                },
                function (error) {
                    loggingIn = false;
                    self.error = error;
                }
            );
            self.error = null;
            loggingIn = true;
        }
    };

});
