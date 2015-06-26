describe('openfda/filters/fdaDate.js', function () {



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
        filter = $filter('fdaDate');
        $httpBackend.resetExpectations();
    }));

    /*
    it('should be defined in module', function () {
        expect(filter).toBeDefined();
    });*/

    //TODO: write your unit tests for fdaDate

    /*
    it('should return proper filtered value', function () {
        expect(filter('something')).toBe('something filtered');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    */

});
