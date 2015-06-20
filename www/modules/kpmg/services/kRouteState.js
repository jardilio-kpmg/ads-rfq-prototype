var angular = require('angular'),
    main = require('../main');

/**
 * A service which extends the functionality of ng-view
 * allowing the user to manage state for a given view
 * when you enter and exit the view. Will watch as the
 * view route changes and maintain a history to determine
 * when you navigate back and attempt to restore previous
 * state data and scroll position.
 * <br/><br/>
 * Inject an instance of this service into
 * your controller under a route and use the data property
 * to fetch any previous state data. Listen on the
 * save trigger for when state needs to be preserved
 * as you are about to leave the view.
 * @class kpmgAngular.services.kRouteState
 * @see https://docs.angularjs.org/guide/services
 * @example
 * angular.module('myapp').controller('MyController', function (kRouteState, kHttp) {
 *      var currentData = kRouteState.data();
 *
 *      kRouteState.save.on(function (data) {
 *          //fired before we leave the current route/view/state
 *          data.listOfItems = this.listOfItems;
 *          data.selectedItem = this.selectedItem;
 *      });
 *
 *      if (currentData) {
 *          //use the data prefetched from previous state so we can maintain context when navigating backward
 *          this.listOfItems = currentData.listOfItems;
 *          this.selectedItem = currentData.selectedItem;
 *      }
 *      else {
 *          //listOfItems service may return new data each time called
 *          kHttp.get('listOfItems.json').success(function (result) {
 *              this.listOfItems = result;
 *          });
 *      }
 * });
 */
main.service('kRouteState', function ($rootScope, $location, $anchorScroll, kUtil) {



    /**
     * @private
     * @type {string}
     */
    var name = 'kRouteState';

    /**
     * @type {RouteHistory[]}
     */
    var history = [];

    /**
     * @type {RouteHistory}
     */
    var current, previous;

    var shouldRestoreScrollPosition, ngView;

    var historyLength = window.history.length;

    var viewContentLoaded, routeChangeSuccess;

    var DIRECTION_FORWARD = 'forward';
    var DIRECTION_BACK = 'back';
    var DIRECTION_NONE = 'none';

    var service = {
        /**
         * Data returns the data object assigned to
         * the current route for persisting in history
         * as the user navigates back in the stack.
         * You can check data() for previously saved
         * state for that given history route to
         * rebuild your current state from.
         * <br/><br/>
         * Unlike session, state is tied to a particular
         * route in a particular point in time of history
         * which is only retrieved when the user navigates
         * back in history. For instance, if you navigate
         * A to B to A, then both instances of A will
         * have a unique state data since you are traveling
         * forward in time. If however you navigate
         * A to B back to A, then in that case both A instances
         * will share the same route state data so
         * you can rebuild your previous state.
         * <br/><br/>
         * Moving forward in navigation will always create
         * a new state data object even for the same path,
         * session data is strictly tied to browser history
         * and navigating back in time.
         *
         * @name kpmgAngular.services.kRouteState#data
         * @methodOf kpmgAngular.services.kRouteState
         * @function
         * @returns {Object}
         */
        data: function () {
            return current.data;
        },

        /**
         * Save is a trigger function which you can attach
         * callbacks to so you are notified when data is
         * expected to be saved before leaving the
         * current route.
         *
         * @name kpmgAngular.services.kRouteState#save
         * @methodOf kpmgAngular.services.kRouteState
         * @function
         * @type {kTrigger}
         */
        save: kUtil.trigger(),

        /**
         * A trigger executed when the route state changes
         * at the completion of a new view loading. A parameter
         * is passed indicating the value of the direction of the change
         * (back, forward or none [reload]).
         * @name kpmgAngular.services.kRouteState#change
         * @methodOf kpmgAngular.services.kRouteState
         * @function
         * @type {kTrigger}
         * @param {string} direction
         */
        change: kUtil.trigger(),

        /**
         * @name kpmgAngular.services.kRouteState#getName
         * @methodOf kpmgAngular.services.kRouteState
         * @function
         * @returns {string}
         */
        getName: function () {
            return name;
        }
    };

    /**
     * This is executed BEFORE we leave the current view
     */
    function onRouteChangeStart() {
        var view = current.scrollTarget ? $(current.scrollTarget) : getNgView();
        var scrollerX = kUtil.getScrollTarget(view, 'x');
        var scrollerY = kUtil.getScrollTarget(view, 'y');
        var rectX = kUtil.getViewPort(scrollerX, 'x');
        var rectY = kUtil.getViewPort(scrollerY, 'y');

        current.left = rectX.x;
        current.top = rectY.y;

        service.save(current.data);//notify listeners to update data
        service.save.off();//remove listeners

        previous = current;
        current = getCurrentState();

        routeChangeSuccess = false;
        viewContentLoaded = false;

        historyLength = window.history.length;

        getNgView().addClass('inactive');

        switch (current.direction) {
        case DIRECTION_BACK:
            //clear out all history entries from this point forward
            history.length = current.historyIndex;
            break;
        case DIRECTION_FORWARD:
            history.push(previous);
            break;
        }
    }

    /**
     * This is executed AFTER $routeChangeStart but may happen before OR after $viewContentLoaded
     * Set routeState data before the view content gets a chance to initialize
     */
    function onRouteChangeSuccess() {
        shouldRestoreScrollPosition = current.direction === DIRECTION_BACK;
        routeChangeSuccess = true;
    }

    /**
     * This is executed AFTER $routeChangeStart if an
     * error occurs during changing the current route.
     */
    function onRouteChangeError() {
        //getNgView().removeClass('inactive');
        historyLength = window.history.length;
    }

    /**
     * This is executed AFTER we enter the new view
     * AND that new view has been loaded to the DOM
     */
    function onViewContentLoaded() {
        shouldRestoreScrollPosition = current.direction === DIRECTION_BACK;
        viewContentLoaded = true;
        getNgView(true);//reset and recapture
    }

    var waitToScroll;

    function onDigest() {
        clearTimeout(waitToScroll);
        if (viewContentLoaded && routeChangeSuccess) {
            if (shouldRestoreScrollPosition) {
                restoreScrollPosition();
                waitToScroll = setTimeout(function () {
                    restoreScrollPosition();
                }, 0);
            }
            else {
                getNgView().removeClass('inactive');
            }
            service.change(current.direction, historyLength);
            viewContentLoaded = routeChangeSuccess = false;
        }
    }

    function restoreScrollPosition(attempts) {
        var view = current.scrollTarget ? $(current.scrollTarget) : getNgView();
        var scrollerX = kUtil.getScrollTarget(view, 'x');
        var scrollerY = kUtil.getScrollTarget(view, 'y');

        //console.log('restoring scroll position ', current.left + ',' + current.top);

        /*
         dumb issue with Chrome, can't set scroll back to where it thinks it should already be, it remembered
         this position as well and with a dynamic async DOM it won't actually go there until the user tries
         to scroll on their own.
         */
        scrollerX.scrollLeft(current.left !== 0 ? current.left+1 : 0);
        scrollerY.scrollTop(current.top !== 0 ? current.top+1 : 0);

        if (attempts === undefined) {
            attempts = 2;
        }

        if (attempts > 0) {
            setTimeout(function () {
                restoreScrollPosition(attempts-1);
            });
            return;
        }

        getNgView().removeClass('inactive');

        shouldRestoreScrollPosition = false;
    }

    /**
     * Finds the ng-view element on the DOM
     * @private
     * @returns {jQuery}
     */
    function getNgView(clearCached) {
        if (clearCached || !ngView || !ngView.length) {
            ngView = $('[ng-view]');

            if (!ngView || ngView.length === 0) {
                ngView = $('ng-view');
            }

            if (!ngView || ngView.length === 0) {
                ngView = $('[data-ng-view]');
            }

            if (!ngView || ngView.length === 0) {
                ngView = $('[x-ng-view]');
            }
        }

        return ngView;
    }

    /**
     * @private
     * @returns {RouteHistory}
     */
    function getCurrentState() {
        /**
         * @type {RouteHistory}
         */
        var routeState = {};
        routeState.path = $location.path();
        routeState.historyIndex = (function () {
            for (var i = 0; i < history.length; i++) {
                if (history[i].path === routeState.path) {
                    return i;
                }
            }
            return -1;
        })();
        routeState.direction = (function () {
            //fall thru from browser back navigation, not from DOM or script
            var previousPath = current ? current.path : '';
            if (previousPath === routeState.path) {
                return DIRECTION_NONE;
            }
            //history length may not increment when moving back, length remains the same as you can still move forward
            return historyLength >= window.history.length && routeState.historyIndex !== -1 ? DIRECTION_BACK : DIRECTION_FORWARD;
        })();

        if (routeState.direction === DIRECTION_FORWARD || routeState.historyIndex === -1) {
            routeState.data = {};
        }
        else {
            routeState = angular.extend({}, history[routeState.historyIndex], routeState);
        }

        return routeState;
    }

    $rootScope.$on('$routeChangeStart', onRouteChangeStart);
    $rootScope.$on('$routeChangeSuccess', onRouteChangeSuccess);
    $rootScope.$on('$routeChangeError', onRouteChangeError);
    $rootScope.$on('$viewContentLoaded', onViewContentLoaded);
    $rootScope.$watch(onDigest);

    current = getCurrentState();

    return service;

});
