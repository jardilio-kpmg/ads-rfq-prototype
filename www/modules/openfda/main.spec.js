var openfda = require('./main');

describe('openfda/main.js', function () {

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

    beforeEach(angular.mock.module('ngMock','openfda'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.resetExpectations();
    }));

    it('should return openfda instance', function () {
        expect(openfda).toBeDefined();
    });

    it('should return app name', function () {
        expect(openfda.name).toBe('openfda');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});

