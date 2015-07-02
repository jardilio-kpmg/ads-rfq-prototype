describe('openfda/filters/fdaClassDesc.js', function () {

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

    var filter;

    beforeEach(angular.mock.module('ngMock','openfda'));

    beforeEach(inject(function ($filter, $injector) {
        $httpBackend = $injector.get('$httpBackend');
        filter = $filter('fdaClassDesc');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(filter).toBeDefined();
    });

    it('should return proper filtered value', function () {
        expect(filter('Class I')).toBe('Dangerous or defective products that predictably could cause serious health problems or death. Examples include: food found to contain botulinum toxin, food with undeclared allergens, a label mix-up on a lifesaving drug, or a defective artificial heart valve.');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});
