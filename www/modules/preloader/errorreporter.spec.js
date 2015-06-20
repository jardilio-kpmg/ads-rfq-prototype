var localization = require('./localization'),
    reporter = require('./errorreporter');

describe('preloader/errorreporter.js', function () {

    beforeEach(function(){
        localization();
        spyOn($, 'ajax');
    });

    it('should return reporter instance', function () {
        expect(reporter).toBeDefined();
    });

    it('should send errors to a server when invoked', function () {
        reporter.send({foo:42});
        expect($.ajax).toHaveBeenCalled();

        var ajaxUrl = $.ajax.calls.mostRecent().args[0];
        expect(ajaxUrl).toBe('api/error');

        var ajaxOptions = $.ajax.calls.mostRecent().args[1];
        expect(ajaxOptions.data).toEqual('{"foo":42}');
        expect(ajaxOptions.type).toEqual('POST');
        expect(ajaxOptions.contentType).toEqual('application/json');
    });
});

