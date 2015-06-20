describe('kpmg/angular/services/kSession.js', function () {



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
     * @type {KSession}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','kpmgAngular'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kSession');
        service2 = $injector.get('kSession');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should be able to clear and restore data', function () {
        expect(service.isAuthenticated()).toBe(false);
        expect(service.data()).toEqual({});

        service.isAuthenticated(true);
        service.data().temp = 'temp';

        expect(service.isAuthenticated()).toBe(true);
        expect(service.data()).toEqual({temp: 'temp'});

        service.data({temp2: 'temp2'});
        expect(service.data()).toEqual({temp2: 'temp2'});

        service.reset();

        expect(service.isAuthenticated()).toBe(false);
        expect(service.data()).toEqual({});
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kSession');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
