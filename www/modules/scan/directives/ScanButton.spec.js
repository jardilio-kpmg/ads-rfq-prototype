describe('scan/directives/ScanButton.js', function () {



    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    var directive, $scope;

    beforeEach(angular.mock.module('ngMock','scan'));

    beforeEach(inject(function (/**function*/ $compile, /**ng.$rootScope.Scope*/$rootScope, $injector) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        directive = angular.element('<scan-button></scan-button>');
        directive = $compile(directive)($scope);
        $rootScope.$digest();
        $httpBackend.resetExpectations();
    }));

    //TODO: write test cases

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
