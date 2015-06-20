var app = require('./main');

describe('app/main.js', function () {

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

    beforeEach(angular.mock.module('ngMock','app'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.resetExpectations();
    }));

    it('should return app instance', function () {
        expect(app).toBeDefined();
    });

    it('should return app name', function () {
        expect(app.name).toBe('app');
    });

    it('should be ready', inject(function ($rootElement) {
        expect($rootElement.hasClass('app')).toBe(true);
        expect($rootElement.hasClass('ready')).toBe(true);
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

