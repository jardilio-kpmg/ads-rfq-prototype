describe('recalls/controllers/SearchCtrl.js', function () {



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
     * @type {recalls.controllers.SearchCtrl}
     */
    var controller;

    var $scope;

    beforeEach(angular.mock.module('ngMock','recalls'));

    beforeEach(inject(function ($injector, $controller, $rootScope) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        controller = $controller('SearchCtrl', {'$scope': $scope});
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(controller).toBeDefined();
    });

    //TODO: write your unit tests for SearchCtrl

    it('should return proper name value', function () {
        expect(controller.getName()).toBe('SearchCtrl');
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
