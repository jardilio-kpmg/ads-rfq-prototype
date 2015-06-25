describe('server/services/upcService.js', function () {



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
     * @type {server.services.upcService}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','server'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('upcService');
        service2 = $injector.get('upcService');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });
    /*
    it('should properly construct getData request without optionals', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.getData('111111111111').success(success).error(error);

        $httpBackend.expectGET('http://api.walmartlabs.com/v1/items?apiKey=hcmmsqz3fcsaj9habtsqet5y&upc=111111111111&callback=foo').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should properly construct getData request with optionals', function () {
        var error = window.jasmine.createSpy('error');
        var success = window.jasmine.createSpy('success');

        service.expect.getData('111111111111', {optional1: ''});

        $httpBackend.expectGET('http://api.walmartlabs.com/v1/items?apiKey=hcmmsqz3fcsaj9habtsqet5y&upc=111111111111&callback=foo').respond({});
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });*/

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
/*
angular.module('server').config(function ($provide) {



    $provide.decorator('upcService', function ($delegate, $httpBackend) {
        /!**
         * This is allows us to decorate our service during unit tests with expectations
         * that can then be shared across all spec files. Not only will we need to set expectionations
         * on this service, but also in any dependency chains. If a controller references this service, we
         * need to set the expectations that the service will be called. Likewise if that controller is
         * defined in a directive and that directive in a view, we need to set these expectation there as well.
         * @class server.services.upcService.expect
         * @extends server.services.upcService
         *!/
        $delegate.expect = {
            getData: function (required1, required2, optionals) {
                var params = angular.extend({}, optionals, {
                    required1: required1,
                    required2: required2
                });
                $httpBackend.expectGET('/server/upc-service/data?' + $.param(params)).respond();
            }
        };

        return $delegate;
    });
});
*/
