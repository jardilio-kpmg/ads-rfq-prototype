/**
 * Unit tests for the view at route /login/
 * @see http://jasmine.github.io/
 */
describe('URL Route: /login/', function () {

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

    beforeEach(angular.mock.module('ngMock','login'));

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

    it('should route to view if authenticated', function () {
        kSession.isAuthenticated(true);
        $location.path('/login/');
        $scope.$apply();
        expect($ngView[0].querySelector('.index')).not.toBe(null);
    });

    //TODO: you need to determine if this view requires authentication
    xit('should not route to view if not authenticated', function () {
        kSession.isAuthenticated(false);
        $location.path('/login/');
        $scope.$apply();
        expect($ngView[0].querySelector('.index')).toBe(null);
    });

    afterEach(function () {
        $ngView.remove();
        $scope.$destroy();
        kSession.reset();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
