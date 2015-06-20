var angular = require('angular'),
    main = require('../main'),
    $win = angular.element(window),
    $doc = angular.element(window.document);

/**
 * A utility service which contains some basic functions used
 * in multiple other services for this module.
 * @private
 * @deprecated
 * @class kpmgAngular.services.kUtil
 * @see https://docs.angularjs.org/guide/services
 * @example
 * angular.module('myapp').service('myService', function (kUtil) {
 *      var save = kUtil.trigger();
 *
 *      function onSave(data) {
 *          save(data);
 *      }
 * });
 */
main.service('kUtil', function () {



    var name = 'kUtil';

    var util = {

        /**
         * Creates a simple trigger function that you may
         * register and remove callbacks from that will be
         * proxied when the trigger is executed. All parameters
         * passed to the trigger when executed will be passed
         * to each of the registered callbacks.
         * @private
         * @deprecated
         * @name kpmgAngular.services.kUtil#trigger
         * @methodOf kpmgAngular.services.kUtil
         * @function
         * @returns {kTrigger}
         */
        trigger: function () {
            var callbacks = [];

            /**
             * Creates a simple trigger function that you may
             * register and remove callbacks from that will be
             * proxied when the trigger is executed. All parameters
             * passed to the trigger when executed will be passed
             * to each of the registered callbacks.
             *
             * @example
             * var trigger = util.trigger();
             * var remove = trigger.on(function (arg1, arg2) {
                 *      //do something when trigger is called
                 * });
             *
             * trigger('value1', 'value2');//proxies to all callbacks registered
             *
             * @class kpmgAngular.services.kTrigger
             * @private
             * @deprecated
             * @returns {function} An off function to remove the listener
             *
             * @see kUtil#trigger
             */
            /*jshint maxcomplexity: false */
            function trigger() {
                var i, callback;
                for (i = 0; i < callbacks.length; i++) {
                    callback = callbacks[i];
                    if (!callback) {
                        continue;
                    }
                    switch (arguments.length) {
                    case 0:
                        callback();
                        break;
                    case 1:
                        callback(arguments[0]);
                        break;
                    case 2:
                        callback(arguments[0], arguments[1]);
                        break;
                    case 3:
                        callback(arguments[0], arguments[1], arguments[2]);
                        break;
                    case 4:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3]);
                        break;
                    case 5:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                        break;
                    case 6:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                        break;
                    case 7:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                        break;
                    case 8:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7]);
                        break;
                    case 9:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8]);
                        break;
                    case 10:
                        callback(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9]);
                        break;
                    default:
                        callback.apply(null, arguments);
                        break;
                    }
                }
            }

            /**
             * Returns true if there are listeners
             * registered to this trigger.
             * @name kpmgAngular.services.kTrigger#hasListeners
             * @methodOf kpmgAngular.services.kTrigger
             * @function
             * @returns {Boolean}
             */
            trigger.hasListeners = function () {
                return callbacks.length > 0;
            };

            /**
             * Register a callback function to be executed when the
             * trigger is fired. Returns a function that when called
             * will remove the given callback using the off method.
             * This is helpful for for anonymous functions.
             * @name kpmgAngular.services.kTrigger#on
             * @methodOf kpmgAngular.services.kTrigger
             * @function
             * @param callback
             * @returns {Function}
             */
            trigger.on = function (callback) {
                callbacks.push(callback);
                return function () {
                    trigger.off(callback);
                };
            };

            /**
             * Removes a callback function so it will no longer be
             * called when teh trigger is fired.
             * @name kpmgAngular.services.kTrigger#off
             * @methodOf kpmgAngular.services.kTrigger
             * @function
             * @param [callback]
             * @returns {Function}
             */
            trigger.off = function (callback) {
                for (var i = 0; i < callbacks.length; i++) {
                    if (callback === undefined || callbacks[i] === callback) {
                        callbacks.splice(i, 1);
                        i--;
                    }
                }
            };

            return trigger;
        },

        /**
         * Finds the closest scrollable container from a given
         * target element.
         * @name kpmgAngular.services.kUtil#getScrollTarget
         * @methodOf kpmgAngular.services.kUtil
         * @function
         * @param elem
         */
        getScrollTarget: function (elem, direction) {
            while (elem.length > 0 && elem[0].localName) {//IE will puke when it gets to HTML where localName is null
                var overflow = elem.css('overflow-' + direction) || elem.css('overflow') || '';
                switch (overflow.toLowerCase()) {
                case 'auto':
                case 'scroll':
                    if (elem[0].localName !== 'body') {
                        return elem;
                    } else {
                        return $win;
                    }
                    break;
                }
                elem = elem.parent();
            }

            return $win;
        },

        /**
         * Returns a rectangle which outlines current size and
         * position of the viewport on the element.
         * @name kpmgAngular.services.kUtil#getViewPort
         * @methodOf kpmgAngular.services.kUtil
         * @function
         * @param elem
         */
        getViewPort: function (elem) {
            var rect = {};
            rect.x = elem.scrollLeft();
            rect.y = elem.scrollTop();
            rect.width = (elem === $win ? $doc.width() : elem[0].scrollWidth);// + elem.offsetX();
            rect.height = (elem === $win ? $doc.height() : elem[0].scrollHeight);// + elem.offsetY();
            /*rect.add = function (buffer) {
                var rect = {};
                var buffer2 = buffer * 2;
                rect.x = this.x - buffer;
                rect.y = this.y + buffer;
                rect.width = this.width + buffer2;
                rect.height = this.height + buffer2;
                return rect;
            };*/
            return rect;
        },

        /**
         * @name kpmgAngular.services.kUtil#getName
         * @methodOf kpmgAngular.services.kUtil
         * @function
         * @returns {string}
         */
        getName: function () {
            return name;
        }
    };

    return util;

});
