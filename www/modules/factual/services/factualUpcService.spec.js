describe('factual/services/factualUpcService.js', function () {

    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    /**
     * @type {factual.services.factualUpcService}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','factual'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('factualUpcService');
        service2 = $injector.get('factualUpcService');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('factualUpcService');
    });

    it('should properly construct getData request', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getData('88888888').success(success).error(error);
        $httpBackend
            .expectGET('//api.v3.factual.com/t/products-cpg?KEY=6tkrAVLSRY503qIo8SMpiPJCJkdqN4GdIJd99co2&filters=%7B%22upc%22:%2288888888%22%7D')
            .respond('');
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


});