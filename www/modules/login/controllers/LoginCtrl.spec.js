describe('login/controllers/LoginCtrl.js', function () {



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
     * @type {login.controllers.LoginCtrl}
     */
    var controller;

    var $scope;

    beforeEach(angular.mock.module('ngMock','login'));

    beforeEach(inject(function ($injector, $controller, $rootScope) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        controller = $controller('LoginCtrl', {'$scope': $scope});
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(controller).toBeDefined();
    });

    it('should return proper name value', function () {
        expect(controller.getName()).toBe('LoginCtrl');
    });

    it('should only be able to login if username and password are provided', inject(function (kSession) {
        spyOn(kSession, 'isAuthenticated');

        controller.login();
        expect(controller.canlogin()).toBe(false);
        expect(kSession.isAuthenticated).not.toHaveBeenCalled();

        controller.username = 'test';
        controller.login();
        expect(controller.canlogin()).toBe(false);
        expect(kSession.isAuthenticated).not.toHaveBeenCalled();

        controller.username = null;
        controller.password = 'test';
        controller.login();
        expect(controller.canlogin()).toBe(false);
        expect(kSession.isAuthenticated).not.toHaveBeenCalled();

        controller.username = 'test';
        controller.password = 'test';
        controller.login();
        expect(controller.canlogin()).toBe(true);
        expect(kSession.isAuthenticated).toHaveBeenCalledWith(true);
    }));

    it('should redirect post login to refer url', inject(function ($routeParams, $location) {
        spyOn($location, 'url');

        $routeParams.refer = '/testrefer';

        controller.username = 'test';
        controller.password = 'test';
        controller.login();

        expect(controller.canlogin()).toBe(true);
        expect($location.url).toHaveBeenCalledWith('/testrefer');
    }));

    it('should redirect post login to default url', inject(function ($routeParams, $location) {
        spyOn($location, 'url');

        controller.username = 'test';
        controller.password = 'test';
        controller.login();

        expect(controller.canlogin()).toBe(true);
        expect($location.url).toHaveBeenCalledWith('/');
    }));

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
