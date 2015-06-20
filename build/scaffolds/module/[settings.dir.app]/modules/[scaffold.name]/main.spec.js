var <%= headlessCamelCase(scaffold.name) %> = require('./main');

describe('<%= scaffold.name %>/main.js', function () {

    'use strict';

    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    beforeEach(angular.mock.module('ngMock','<%= headlessCamelCase(scaffold.name) %>'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.resetExpectations();
    }));

    it('should return <%= scaffold.name %> instance', function () {
        expect(<%= headlessCamelCase(scaffold.name) %>).toBeDefined();
    });

    it('should return app name', function () {
        expect(<%= headlessCamelCase(scaffold.name) %>.name).toBe('<%= headlessCamelCase(scaffold.name) %>');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

