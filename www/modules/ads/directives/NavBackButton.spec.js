describe('ads/directives/NavBackButton.js', function () {



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

    beforeEach(angular.mock.module('ngMock','ads'));

    beforeEach(inject(function (/**function*/ $compile, /**ng.$rootScope.Scope*/$rootScope, $injector) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        directive = angular.element('<nav-back-button></nav-back-button>');
        directive = $compile(directive)($scope);
        $rootScope.$digest();
        $httpBackend.resetExpectations();
    }));

    it('should add custom class to element', function () {
        expect(directive.hasClass('nav-back-button')).toBe(true);
        expect(directive.hasClass('ads')).toBe(true);
    });

    it('should add template children', function () {
        expect(directive.children().length).not.toBe(0);
    });

    it('should navigate home on click if we have not progressed', inject(function ($location) {
        var path = spyOn($location, 'path'),
            search = spyOn($location, 'search');

        directive.trigger('click');

        expect(path).toHaveBeenCalledWith('/');
        expect(search).toHaveBeenCalledWith({});
    }));

    it('should navigate to previous page if we have progressed in history', function () {
        //add a new page to the history
        window.location.hash = '#/doesnotexist';

        var back = spyOn(window.history, 'back');
        directive.trigger('click');
        expect(back).toHaveBeenCalled();
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
