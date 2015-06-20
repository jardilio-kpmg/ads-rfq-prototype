describe('kpmg/angular/services/kAuth.js', function () {



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
     * @type {kpmgAngular.services.kAuth}
     */
    var service, service2;

    var $http;

    beforeEach(angular.mock.module('ngMock','kpmgAngular'));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kAuth');
        service2 = $injector.get('kAuth');
        $http = $injector.get('$http');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should correctly encode an authorization header', function () {
        expect(service.encode('john.doe','password')).toBe('Basic am9obi5kb2U6cGFzc3dvcmQ=');
    });

    it('should return authentication', function () {
        service.clearAuthentication();
        expect(service.getAuthentication()).not.toBeDefined();
        $httpBackend.expectGET('something', {Accept: 'application/json, text/plain, */*'}).respond([200,'']);
        $http.get('something');
        $httpBackend.flush();

        service.setAuthentication('john.doe','password');
        expect(service.getAuthentication()).toBe('Basic am9obi5kb2U6cGFzc3dvcmQ=');
        $httpBackend.expectGET('something', {
            Accept: 'application/json, text/plain, */*',
            Authorization: 'Basic am9obi5kb2U6cGFzc3dvcmQ='
        }).respond([200,'']);
        $http.get('something');
        $httpBackend.flush();
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kAuth');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
