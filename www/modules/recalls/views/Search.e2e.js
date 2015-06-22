/**
 * End-to-end integration tests for the view at route /recalls/search
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/search', function () {



    beforeEach(function() {
        browser.get('/recalls/search');
        //TODO: any additional setup for each test
    });

    it('should route to view if authenticated', function () {
        //TODO: add required steps to login
        expect(browser.getLocationAbsUrl()).toMatch(/#\/recalls\/search$/);
        expect(element(by.css('.search')).isPresent()).toBe(true);
    });

    it('should not route to view if not authenticated', function () {
        //TODO: add required steps to logout
        expect(browser.getLocationAbsUrl()).toMatch(/#\/login/);
        expect(element(by.css('.search')).isPresent()).toBe(false);
    });

    //TODO: write your integration tests for Search

    afterEach(function () {
        //TODO: any additional tear down steps for each test
    });

});
