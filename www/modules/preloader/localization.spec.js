var localization = require('./localization'),
    errorhandler = require('./errorhandler'),
    errorcodes = require('./errorcodes');

//make sure this is run before any specs in any files
localization();

describe('preloader/localization.js', function() {

    it('is initialized with jquery', function(){
        expect($.t).toBeTruthy();
    });

    it('has "locale" and "title" keys', function(){
        var title = $.t('preloader.title');
        expect(title).toBeTruthy();
        expect(title).not.toBe('title');

        var locale = $.t('preloader.locale');
        expect(locale).toBeTruthy();
        expect(locale).not.toBe('locale');

    });

    it('handles missing keys by reporting them as errors', function(){
        spyOn(window.i18n.options, 'missingKeyHandler').and.callThrough();
        spyOn(errorhandler, 'handleError');

        var missingValue = $.t('thiskeyshouldnotreallyexist');

        expect(missingValue).toBe('thiskeyshouldnotreallyexist');
        expect(window.i18n.options.missingKeyHandler).toHaveBeenCalled();
        expect(errorhandler.handleError).toHaveBeenCalled();
        var errorHandlerArgs = errorhandler.handleError.calls.mostRecent().args;
        expect(errorHandlerArgs[0]).toBe(errorcodes.MISSING_LOCALIZATION_STRING);
        expect(errorHandlerArgs[1].indexOf('thiskeyshouldnotreallyexist')).not.toBe(-1);
    });


});
