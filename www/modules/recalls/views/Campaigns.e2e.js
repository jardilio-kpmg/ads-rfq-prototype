/**
 * End-to-end integration tests for the view at route /recalls/campaigns
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/campaigns', function () {



    beforeEach(function() {
        browser.get('/recalls/campaigns');
        //TODO: any additional setup for each test
    });

    it('should route to view if authenticated', function () {
        //TODO: add required steps to login
        expect(browser.getLocationAbsUrl()).toMatch(/#\/recalls\/campaigns$/);
        expect(element(by.css('.campaigns')).isPresent()).toBe(true);
    });

    it('should not route to view if not authenticated', function () {
        //TODO: add required steps to logout
        expect(browser.getLocationAbsUrl()).toMatch(/#\/login/);
        expect(element(by.css('.campaigns')).isPresent()).toBe(false);
    });

    //TODO: write your integration tests for Campaigns

    afterEach(function () {
        //TODO: any additional tear down steps for each test
    });

});
