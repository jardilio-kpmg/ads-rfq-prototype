describe('kpmg/angular/services/kRedirect.js', function () {



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
     * @type {KRedirect}
     */
    var service, service2;

    var session, $location, $scope, $ngView;

    beforeEach(angular.mock.module('ngMock','kpmgAngular', ['$routeProvider', 'kRedirectProvider', function ($routeProvider, redirectProvider) {
        service = redirectProvider;
        $routeProvider
            .when('/test1', {redirectTo: redirectProvider.ifNotAuthenticated('/login', true)})
            .when('/test2', {redirectTo: redirectProvider.ifMatchMedia('(min-width: 0px)', '/match')})
            .when('/test3', {redirectTo: redirectProvider.ifNotMatchMedia('(max-width: 0px)', '/notmatch')})
            .when('/test4', {redirectTo: redirectProvider.toFirstMatch(
                redirectProvider.ifNotAuthenticated ('/login'),
                redirectProvider.ifMatchMedia('(min-width: 0px)', '/match')
            )});
    }]));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kRedirect');
        service2 = $injector.get('kRedirect');
        session = $injector.get('kSession');
        $location = $injector.get('$location');
        $scope = $injector.get('$rootScope').$new();
        $httpBackend.resetExpectations();

        var $compile = $injector.get('$compile');
        $ngView = angular.element('<div id="container"><div ng-view></div></div>');
        angular.element('body').append($ngView);
        $ngView = $compile($ngView)($scope);
        $scope.$apply();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should redirect based on authentication', function () {
        session.isAuthenticated(false);
        $location.path('/test1');
        $scope.$apply();
        expect($location.path()).toBe('/login');

        session.isAuthenticated(true);
        $scope.$apply();
        $location.path('/test1');
        $scope.$apply();
        expect($location.path()).toBe('/test1');
    });

    it('should redirect based on media query', function () {
        $location.path('/test2');
        $scope.$apply();
        expect($location.path()).toBe('/match');

        $location.path('/test3');
        $scope.$apply();
        expect($location.path()).toBe('/notmatch');
    });

    it('should redirect first match', function () {
        session.isAuthenticated(false);
        $scope.$apply();

        $location.path('/test4');
        $scope.$apply();
        expect($location.path()).toBe('/login');

        session.isAuthenticated(true);
        $location.path('/test4');
        $scope.$apply();
        expect($location.path()).toBe('/match');
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kRedirect');
    });

    afterEach(function () {
        $ngView.remove();
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
