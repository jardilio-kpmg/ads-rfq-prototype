var loadingScreen = require('./loadingScreen'),
    selector = '.preload.spinner';

describe('preloader/loadingscreen.js', function() {

    beforeEach(function () {
        loadingScreen.remove();
    });

    it('should show and hide', function (){
        expect($(selector).length).toBe(0);
        loadingScreen.show();
        expect($(selector).length).toBe(1);
        loadingScreen.remove();
        expect($(selector).length).toBe(0);
    });

    it('should only show once', function () {
        loadingScreen.show();
        loadingScreen.show();
        expect($(selector).length).toBe(1);
    });

    afterEach(function () {
        loadingScreen.remove();
    });

});
