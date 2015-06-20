<%
var pathprefix = scaffold.module === settings.defaultmodule ? '' : hyphenCase(scaffold.module) + '/';
var pathsuffix;

switch(scaffold.name.toLowerCase()) {
case 'index':
case 'home':
case 'default':
    pathsuffix = '';
    break;
default:
    pathsuffix = hyphenCase(scaffold.name);
    break;
}

var path = '/' + pathprefix + pathsuffix,
    pathregx = path.split('/').join('\\/');
%>/**
 * End-to-end integration tests for the view at route <%= path %>
 * @see http://angular.github.io/protractor/#/
 * @see http://jasmine.github.io/
 */
describe('URL Route: <%= path %>', function () {



    beforeEach(function() {
        browser.get('<%= path %>');
        //TODO: any additional setup for each test
    });

    it('should route to view if authenticated', function () {
        //TODO: add required steps to login
        expect(browser.getLocationAbsUrl()).toMatch(/#<%= pathregx %>$/);
        expect(element(by.css('.<%= hyphenCase(scaffold.name) %>')).isPresent()).toBe(true);
    });

    it('should not route to view if not authenticated', function () {
        //TODO: add required steps to logout
        expect(browser.getLocationAbsUrl()).toMatch(/#\/login/);
        expect(element(by.css('.<%= hyphenCase(scaffold.name) %>')).isPresent()).toBe(false);
    });

    //TODO: write your integration tests for <%= scaffold.name %>

    afterEach(function () {
        //TODO: any additional tear down steps for each test
    });

});
