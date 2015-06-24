/**
 * End-to-end integration tests for the view at route /recalls/search
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/search', function () {

    beforeEach(function() {
        browser.get('#/recalls/search');
    });

    it('should route to view', function () {
        expect(browser.getLocationAbsUrl()).toMatch(/\/recalls\/search$/);
        expect(element(by.css('.recalls.search')).isPresent()).toBe(true);
    });

    afterEach(function () {

    });

});
