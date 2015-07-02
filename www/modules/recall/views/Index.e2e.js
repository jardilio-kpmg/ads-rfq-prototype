/**
 * End-to-end integration tests for the view at route /recalls/campaigns
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recall/:id', function () {



    beforeEach(function() {
        browser.get('/recall/123');
        //TODO: any additional setup for each test
    });

    it('should route to view', function () {
        //TODO: add required steps to login
        expect(browser.getLocationAbsUrl()).toMatch(/#\/recall\/123/);
        expect(element(by.css('.recall.index')).isPresent()).toBe(true);
    });

    //TODO: write your integration tests for Campaigns

    afterEach(function () {
        //TODO: any additional tear down steps for each test
    });

});
