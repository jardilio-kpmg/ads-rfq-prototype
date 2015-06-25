var main = require('../main'),
    angular = require('angular');

/**
 * This service may be registered as a default $http interceptor for all
 * $http calls. If there are active animations on the screen, it will hold the response
 * from processing and potentially causing a digest cycle that will update your
 * screen in the middle of a transition between states via an animation. Once the animation
 * completes, the response will proceed.
 *
 * @class kpmgAngular.services.kRedirect
 * @see https://docs.angularjs.org/guide/services
 * @example
 * angular.module('myapp').config(function ($httpProvider) {
 *      $httpProvider.interceptors.push('kHttpOptimizer');
 * }
 */
main.provider('kHttpOptimizer', function ($httpProvider, $provide) {
    var numActiveAnimations = 0,
        pendingResponses = [];

    //stack all responses in a single digest
    $httpProvider.useApplyAsync();

    //hook into animations and wait for them to resolve before flushing pending responses
    $provide.decorator('$animate', function ($delegate) {
        angular.forEach(['animate','enter','leave','setClass'], function (func) {
            var base = $delegate[func];
            $delegate[func] = function () {
                numActiveAnimations++;
                return base.apply($delegate, arguments).finally(function () {
                    numActiveAnimations--;
                    if (numActiveAnimations === 0) {
                        angular.forEach(pendingResponses, function (response) {
                            response();
                        });
                        pendingResponses = [];
                    }
                });
            };
        });
        return $delegate;
    });

    //return a service that will intercept responses and hold them if there are active animations
    return {
        $get: ['$q', function ($q) {
            return {
                response: function (response) {
                    if (numActiveAnimations > 0) {
                        var promise = $q(function (resolve) {
                            pendingResponses.push(function () {
                                resolve(response);
                            });
                        });
                        return promise;
                    }
                    return response;
                }
            };
        }]
    };
});