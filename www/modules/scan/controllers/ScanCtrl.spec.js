describe('scan/controllers/ScanCtrl.js', function () {



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
     * @type {scan.controllers.ScanCtrl}
     */
    var controller;

    var $scope;

    beforeEach(angular.mock.module('ngMock','scan'));

    beforeEach(inject(function ($injector, $controller, $rootScope) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        controller = $controller('ScanCtrl', {'$scope': $scope});
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(controller).toBeDefined();
    });

    //TODO: write your unit tests for ScanCtrl

    it('should return proper name value', function () {
        expect(controller.getName()).toBe('ScanCtrl');
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
