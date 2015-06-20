var localization = require('./localization'),
    errorHandler = require('./errorhandler'),
    errorDialog = require('./errordialog'),
    errorReporter = require('./errorreporter');

describe('preloader/errorhandler.js', function () {

    beforeEach(function () {
        localization();
        spyOn(errorReporter, 'send');
        spyOn(errorDialog, 'show');
        spyOn(window.location, 'reload');
    });

    it('reports and displays a dialog for unhandled exceptions', function() {
        window.onerror('Fake Error', 'null.js', -1);
        expect(errorReporter.send).toHaveBeenCalled();
        expect(errorDialog.show).toHaveBeenCalled();
    });

    it('reports & displays errors raised with a display message', function(){
        errorHandler.handleError(-1,'Fake message to log', 'Fake message to display');

        expect(errorReporter.send).toHaveBeenCalled();
        var reporterArg = errorReporter.send.calls.mostRecent().args[0];
        expect(reporterArg.id).toBeDefined();
        expect(reporterArg.errorCode).toEqual(-1);
        expect(reporterArg.message).toEqual('Fake message to log');
        expect(reporterArg.url).toEqual(window.location.toString());
        expect(reporterArg.logHistory).toEqual([]);

        expect(errorDialog.show).toHaveBeenCalled();
        var dialogArg = errorDialog.show.calls.mostRecent().args[0];
        expect(dialogArg.id).toBeDefined();
        expect(dialogArg.message).toEqual('Fake message to display');

        expect(dialogArg.id).toEqual(reporterArg.id);
    });

    it('reports but does not display errors raised without a display message', function(){
        errorHandler.handleError(-1,'Fake message to log');

        expect(errorReporter.send).toHaveBeenCalled();
        expect(errorDialog.show).not.toHaveBeenCalled();
    });

    it('intercepts console.log message for inclusion in error reports', function(){
        console.log('Example console.log message');
        errorHandler.handleError(-1,'Fake message to log');
        expect(errorReporter.send).toHaveBeenCalled();
        var reporterArg = errorReporter.send.calls.mostRecent().args[0];
        expect(reporterArg.logHistory.length).toEqual(1);
        expect(reporterArg.logHistory[0].indexOf('Example console.log message')).not.toEqual(-1);
    });

    it('keeps a rolling history of console.log messages', function(){
        errorHandler.handleError(-1,'Fake message to log');
        var reporterArg = errorReporter.send.calls.mostRecent().args[0];
        expect(reporterArg.logHistory.length).toEqual(0);

        for(var i = 0; i <= 50; i++) {
            console.log('Message ' + i);
        }

        errorHandler.handleError(-1,'Fake message to log');
        reporterArg = errorReporter.send.calls.mostRecent().args[0];
        expect(reporterArg.logHistory.length).toBeGreaterThan(5);
        expect(reporterArg.logHistory.length).toBeLessThan(40);
        expect(reporterArg.logHistory[0].indexOf('Message 0')).toEqual(-1);
        expect(reporterArg.logHistory[reporterArg.logHistory.length-1].indexOf('Message 50')).not.toEqual(-1);
    });

    it('ignores exceptions that appear to come from chrome browser extensions', function(){
        window.onerror('Fake Extension Error', 'chrome://someextenstion/null.js', -1);
        expect(errorReporter.send).not.toHaveBeenCalled();
        expect(errorDialog.show).not.toHaveBeenCalled();
    });

});
