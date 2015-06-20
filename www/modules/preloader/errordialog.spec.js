var localization = require('./localization'),
    dialog = require('./errordialog');

describe('preloader/errordialog.js', function () {

    beforeEach(function(){
        localization();
        spyOn(window, 'confirm').and.returnValue(true);
        spyOn(window.location, 'reload');
    });

    it('should return dialog instance', function () {
        expect(dialog).toBeDefined();
    });

    it('should show an prompt and reload when an exception occurs within dialog.show', function() {
        spyOn($.fn, 'modal').and.throwError('Example of what would happen if bootstrap is not yet loaded');
        dialog.show({
            id: 'foo',
            message: 'bar'
        });
        expect(window.confirm).toHaveBeenCalled();
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should reload the page after the alert is dismissed', function() {
        dialog.show({
            id: 'foo',
            message: 'bar'
        });
        expect(window.location.reload).not.toHaveBeenCalled();
        $('#errorDialogModal .btn-primary').trigger('click');
        expect(window.location.reload).toHaveBeenCalled();
    });

    it('should show the error id and message in the alert', function() {
        dialog.show({
            id: 'foo',
            message: 'bar'
        });
        var modal = $('#errorDialogModal').html();
        expect(modal).toContainText('bar');
        expect(modal).toContainText('foo');
    });

});
