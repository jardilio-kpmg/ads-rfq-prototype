var main = require('../main'),
    i18n = require('i18next'),
    angular = require('angular');

var hasLocalized = false;

/**
 * @type {ng.$rootScope.Scope}
 */
var $rootScope;

/**
 * Uses i18next library to localize a given key using the current locale.
 * @name kpmgAngular.filters.#kLocalize
 * @memberOf kpmgAngular.filters
 * @function
 * @param {string} key The path in the JSON file to load the key value from for the translation.
 * This may include an optional bundlename if not default, ie 'bundlename:json.key.name'.
 * @param {string|object=} replacements Use to replace identifiers in translation string with contant
 * values. If the key value is 'Step __0__ of __1__', you can do: kLocalize('key', 9, 10) and output 'Step 9 of 10'.
 * Likewise you can use an object has and replace the keys in the object with the applicable value. If the key value is
 * 'Welcome __username__', you can do: kLocalize('key', {username: 'jdoe'}) and output 'Welcome jdoe'.
 * @param {...string} replaceMore A string value to replace
 * @return {string}
 * @see http://i18next.com/
 * @see http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
 * @example {@lang xml}
 * <span>{{'key'|kLocalize}}></span>
 * @example {@lang xml}
 * <span>{{'bundlename:json.key.name'|kLocalize}}></span>
 * @example {@lang xml}
 * <span>{{'Welcome, __username__'|kLocalize,currentUser.username}}></span>
 * @example {@lang xml}
 * <span>{{'Step __0__ of __1__'|kLocalize,currentStep,totalSteps}}></span>
 * @example
 * function MyCtrl (kLocalizeFilter) {
 *     var filtered = kLocalizeFilter('something');
 * }
 */
main.filter('kLocalize', function () {
    var translate = i18n.t;
    var isObject = angular.isObject;
    var extend = angular.extend;
    var namespaces = {};

    return function (key, replace) {
        var i;
        var options = {defaultValue: ''};
        var keyParts = key.split(i18n.options.nsseparator);

        if (keyParts.length === 2) {
            var namespace = keyParts[0];

            if (!namespaces[namespace]) {
                var inamespaces = i18n.options.ns.namespaces || [];
                var requiresLoad = true;

                namespaces[namespace] = true;

                for (i = 0; i < inamespaces.length; i++) {
                    if (inamespaces[i] === namespace) {
                        requiresLoad = false;
                        break;
                    }
                }

                if (requiresLoad) {
                    i18n.loadNamespace(namespace, function () {
                        //trigger updates to display
                        $rootScope.$broadcast('kLocalizeChanged');
                        if (!$rootScope.$$phase) {
                            $rootScope.$apply();
                        }
                    });
                }
            }
        }

        hasLocalized = true;

        if (replace) {
            if (isObject(replace)) {
                options = extend(options, replace);
            }
            else {
                for (i = 1; i < arguments.length; i++) {
                    options[(i - 1).toString()] = arguments[i];
                }
            }
        }

        return translate(key, options);
    };

});

main.run(function ($injector) {
    $rootScope = $injector.get('$rootScope');

    i18n.init(function () {
        if (hasLocalized) {
            //trigger updates to display
            $scope.$applyAsync(function () {
                $rootScope.$broadcast('kLocalizeChanged');
            });
        }
    });
});
