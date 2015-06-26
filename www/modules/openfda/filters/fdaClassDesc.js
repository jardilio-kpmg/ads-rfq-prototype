var main = require('../main');

/**
 * @name openfda.filters.#fdaClassDesc
 * @memberOf openfda.filters
 * @function
 * @param {string} input
 * @return {string}
 * @see http://docs.angularjs.org/guide/dev_guide.templates.filters.creating_filters
 * @example {@lang xml}
 * <span>{{someScopeExpression|fdaClassDesc}}></span>
 * @example
 * function MyCtrl (fdaClassDescFilter) {
 *     var filtered = fdaClassDescFilter('something');
 * }
 */
main.filter('fdaClassDesc', function (/**kpmg.filters.kLocalize*/ kLocalizeFilter) {

    'use strict';

    /**
     * The description for the Class I category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class1Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    var class1Description = kLocalizeFilter('openfda.classDistribution.class1Description');

    /**
     * The description for the Class II category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class2Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    var class2Description = kLocalizeFilter('openfda.classDistribution.class2Description');

    /**
     * The description for the Class III category.
     * @name recalls.controllers.ClassificationDistributionCtrl#class3Description
     * @propertyOf recalls.controllers.ClassificationDistributionCtrl
     * @type {string}
     */
    var class3Description = kLocalizeFilter('openfda.classDistribution.class3Description');

    return function (input) {

        var desc = "";

        if (input === 'Class I') {
            desc = class1Description;

        }
        else if (input === 'Class II') {
            desc = class2Description;

        }
        else if (input === 'Class III') {
            desc = class3Description;
        }

        return desc;
    };
});
