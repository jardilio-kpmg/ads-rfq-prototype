describe('recalls/controllers/CampaignsCtrl.js', function () {



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
     * @type {recalls.controllers.CampaignsCtrl}
     */
    var controller;

    var $scope;

    beforeEach(angular.mock.module('ngMock','recalls'));

    beforeEach(inject(function ($injector, $controller, $rootScope) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        controller = $controller('CampaignsCtrl', {'$scope': $scope});
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(controller).toBeDefined();
    });

    //TODO: write your unit tests for CampaignsCtrl

    it('should return proper name value', function () {
        expect(controller.getName()).toBe('CampaignsCtrl');
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
