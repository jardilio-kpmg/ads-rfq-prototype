/**
 * End-to-end integration tests for the view at route /recalls/classification-distribution
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/classification-distribution', function () {



    beforeEach(function() {
        browser.get('/recalls/classification-distribution');
        //TODO: any additional setup for each test
    });

    it('should route to view if authenticated', function () {
        //TODO: add required steps to login
        expect(browser.getLocationAbsUrl()).toMatch(/#\/recalls\/classification-distribution$/);
        expect(element(by.css('.classification-distribution')).isPresent()).toBe(true);
    });

    it('should not route to view if not authenticated', function () {
        //TODO: add required steps to logout
        expect(browser.getLocationAbsUrl()).toMatch(/#\/login/);
        expect(element(by.css('.classification-distribution')).isPresent()).toBe(false);
    });

    //TODO: write your integration tests for ClassificationDistribution

    afterEach(function () {
        //TODO: any additional tear down steps for each test
    });

});
