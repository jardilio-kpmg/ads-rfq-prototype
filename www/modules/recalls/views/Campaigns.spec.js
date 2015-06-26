/**
 * Unit tests for the view at route /recalls/campaigns
 * @see http://jasmine.github.io/
 */
describe('URL Route: /recalls/campaigns', function () {

    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    var $ngView, $scope, $location;

    /**
     * @type {kpmgAngular.services.kSession}
     */
    var kSession;

    beforeEach(angular.mock.module('ngMock','recalls'));

    beforeEach(inject(function (/**function*/ $compile, /**ng.$rootScope.Scope*/ $rootScope, $injector) {
        $scope = $rootScope;
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        kSession = $injector.get('kSession');
        $ngView = angular.element('<div id="container"><div ng-view></div></div>');
        angular.element('body').append($ngView);
        $ngView = $compile($ngView)($scope);
        $httpBackend.resetExpectations();
    }));

    it('should route to view', function () {
        $location.path('/recalls/campaigns/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        $httpBackend.expectGET('//api.fda.gov/food/enforcement.json?search=_id:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&api_key=CGEoOaTA5x5mmrKoA677SU7hW6tLjR94l33eDGic&limit=1&skip=0').respond({});
        $httpBackend.flush();
        $scope.$apply();
        expect($ngView[0].querySelector('.recalls.campaigns')).not.toBe(null);
    });

    afterEach(function () {
        $ngView.remove();
        $scope.$destroy();
        kSession.reset();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
