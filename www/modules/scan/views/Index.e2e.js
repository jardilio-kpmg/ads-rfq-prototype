/**
 * End-to-end integration tests for the view at route /recalls/
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/', function () {

    beforeEach(function() {
        browser.get('#/recalls/');
    });

    it('should route to view', function () {
        expect(browser.getLocationAbsUrl()).toMatch(/\/recalls\/$/);
        expect(element(by.css('.recalls.index')).isPresent()).toBe(true);
    });

    //TODO: is there a good way to force file input selection for automated testing?

    afterEach(function () {

    });

});
