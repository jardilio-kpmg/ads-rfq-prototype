var main = require('../main');

/**
 * This is directive solution for i18n attributes that works with the
 * kLocalize filter function. This is to be used for simple key value
 * pairs that don't require special bindings or replacements. This saves
 * on CPU cycles for simple translations since you don't need to keep
 * processing the filter function on each digest cycle.
 *
 * You can also use an optional i18n-options attribute and bind to
 * an expression that returns either an array or object to be used
 * as the replacement options in the translation string value for
 * kLocalize.
 *
 * This will take the translated value and render it as HTML in the
 * attached element.
 * @see kpmgAngular.filters.kLocalize
 * @name kpmgAngular.directives.i18n
 * @propertyOf kpmgAngular.directives
 * @see http://docs.angularjs.org/guide/directive
 * @example
 * <div i18n="myns:myKey" i18n-options="scopeExpressionToReplacements"></div>
 */
main.directive('i18n', function (kLocalizeFilter) {
    return {
        //priority of this directive to be processed over others on same element, higher number processed first
        priority: 0,
        //if true, no other directives will be processed after this priority has been completed
        terminal: false,
        //if true, will create new child scope for element, if object then will create isolated scope
        scope: false,
        //optional function or string name of registered controller to link to this directive
        //controller: 'I18NCtrl',
        //controllerAs: 'i18N',
        //optional string name to require another directive to exist on target element
        require: [],
        //restrict directive declarations to elements (E), attributes (A), classes (C) and comments (M)
        restrict: 'A',
        //optional (string) template if this directive will produce some markup on element, can also use templateUrl
        template: null,
        //if true, innerHTML of the target element will be transcluded and inserted into template where ng-transclude is used
        transclude: false,
        //the link function post compile
        link: function ($scope, $elem, $attr) {
            var key, options;

            $attr.$observe('i18n', function (value) {
                key = value;
                applyTranslations();
            });

            $scope.$watch($attr.i18nOptions, function (value) {
                options = value;
                applyTranslations();
            });

            $scope.$on('kLocalizeChanged', function () {
                applyTranslations();
            });

            function applyTranslations() {
                if (key && options) {
                    $elem.html(kLocalizeFilter.apply(null, [key].concat(options)));
                }
                else if (key) {
                    $elem.html(kLocalizeFilter(key));
                }
            }
        }
    };
});
