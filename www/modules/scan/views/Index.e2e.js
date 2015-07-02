/**
 * End-to-end integration tests for the view at route /recalls/
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /scan/', function () {

    beforeEach(function() {
        browser.get('#/scan/');
    });

    it('should route to view', function () {
        expect(browser.getLocationAbsUrl()).toMatch(/\/scan\/$/);
        expect(element(by.css('.scan.index')).isPresent()).toBe(true);
    });

    //TODO: is there a good way to force file input selection for automated testing?

    afterEach(function () {

    });

});
