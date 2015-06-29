/**
 * End-to-end integration tests for the view at route /recalls/search
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /search', function () {

    beforeEach(function() {
        browser.get('#/search');
    });

    it('should route to view', function () {
        expect(browser.getLocationAbsUrl()).toMatch(/\/search$/);
        expect(element(by.css('.search.index')).isPresent()).toBe(true);
    });

    afterEach(function () {

    });

});
