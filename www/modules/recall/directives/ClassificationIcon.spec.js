describe('recall/directives/ClassificationIcon.js', function () {



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

    beforeEach(angular.mock.module('ngMock','recall'));

    beforeEach(inject(function (/**function*/ $compile, /**ng.$rootScope.Scope*/$rootScope, $injector) {
        $scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        directive = angular.element('<classification-icon classification="{{classification}}"></classification-icon>');
        directive = $compile(directive)($scope);
        $rootScope.$digest();
        $httpBackend.resetExpectations();
    }));

    it('should add custom class to element', function () {
        expect(directive.hasClass('classification-icon')).toBe(true);
        expect(directive.hasClass('recall')).toBe(true);
    });

    it('should add correct icon for Class I', function () {
        $scope.$apply(function () {
            $scope.classification = 'Class I';
        });
        expect(directive.find('.classification-1').length).toBe(1);
    });

    it('should add correct icon for Class II', function () {
        $scope.$apply(function () {
            $scope.classification = 'Class II';
        });
        expect(directive.find('.classification-2').length).toBe(1);
    });

    it('should add correct icon for Class III', function () {
        $scope.$apply(function () {
            $scope.classification = 'Class III';
        });
        expect(directive.find('.classification-3').length).toBe(1);
    });

    afterEach(function () {
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
