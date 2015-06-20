var errorhandler = require('./errorhandler'),
    errorcodes = require('./errorcodes');

/**
 * Initializing the localization configurations.
 * @module preloader/localization
 * @example
 * require('preloader/localization')();
 */
module.exports = function() {

    var i18n = require('i18next'),
        $ = require('jquery');

    i18n.init({
        // Add locales here.
        // Specific (en-US) or non-specific (en) locales can be used.
        //
        // For each locale listed, a translation file must exist in
        // (/app/locales/{locale}/translation.json)
        //
        // Note that 'qps' is the 'pseudoloc' test locale.
        lngWhitelist: [
            'en',
            'qps'
        ],
        detectLngQS: 'lang', // querystring parameter to check
        cookieName: 'lang', // cookie to check (if no querystring)
        fallbackLng: 'en', // default language (if no querystring or cookie or if translation is missing)
        getAsync: false, // block loading the rest of the app until strings are ready
        useDataAttrOptions: true, // support data-i18n-options as a way to pass in variables (http://stackoverflow.com/a/25065788/518955)

        // Notify the error handling component of missing strings
        // so that these errors can be reported to the web server
        // in a way consistent with other types of errors.
        sendMissing: true,
        missingKeyHandler: function (lng, ns, key, defaultValue, lngs) {
            var message =  'Missing translation of "' + key + '" from {' + lngs.join(',') + '}/' + ns + '.json';
            errorhandler.handleError( errorcodes.MISSING_LOCALIZATION_STRING, message);
        }
    });

    $(document).i18n();
};
