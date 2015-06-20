describe('kpmg/angular/services/kHttp.js', function () {



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
     * @type {KHttp}
     */
    var service, service2;

    beforeEach(angular.mock.module('ngMock','kpmgAngular', ['$routeProvider', 'kRedirectProvider', function ($routeProvider, redirectProvider) {
        service = redirectProvider;
        $routeProvider
            .when('/test1', {redirectTo: redirectProvider.ifNotAuthenticated('/login')})
            .when('/test2', {redirectTo: redirectProvider.ifMatchMedia('(min-width: 0px)', '/match')})
            .when('/test3', {redirectTo: redirectProvider.ifNotMatchMedia('(max-width: 0px)', '/notmatch')});
    }]));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kHttp');
        service2 = $injector.get('kHttp');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should resolve default and config parameter options in url path', function () {
        var error = window.jasmine.createSpy();
        var success = window.jasmine.createSpy();

        $httpBackend.expectGET('http://somedomain.com:8080/path/to/johndoe.json?getparam=getparam').respond([200,'']);
        service.defaults.serverenv = 'http://somedomain.com:8080';
        service.get(':serverenv/path/to/:username.json', {params: {username: 'johndoe', getparam: 'getparam'}}).success(success).error(error);
        $httpBackend.flush();

        expect(error).not.toHaveBeenCalled();
        expect(success).toHaveBeenCalled();
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kHttp');
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
