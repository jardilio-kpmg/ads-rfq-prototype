describe('scan/controllers/HomeScreenToastCtrl.js', function () {



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
     * @type {scan.controllers.HomeScreenToastCtrl}
     */
    var controller;

    var $scope;

    beforeEach(angular.mock.module('ngMock','scan'));

    beforeEach(inject(function ($injector, $controller, $rootScope) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        controller = $controller('HomeScreenToastCtrl', {'$scope': $scope});
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(controller).toBeDefined();
    });

    //TODO: write your unit tests for HomeScreenToastCtrl

    it('should return proper name value', function () {
        expect(controller.getName()).toBe('HomeScreenToastCtrl');
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
