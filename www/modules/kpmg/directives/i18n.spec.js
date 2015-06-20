describe('kpmg/angular/directives/i18n.js', function () {
    /**
     * $httpBackend is used to flush http requests which may be linked thru
     * services in your controller to be performed synchronously.
     *
     * @see http://docs.angularjs.org/api/ngMock.$httpBackend
     * @see http://docs.angularjs.org/api/ngMockE2E.$httpBackend
     * @type {ng.$httpBackend}
     */
    var $httpBackend;

    var directive, $scope, oldOptions;

    beforeEach(angular.mock.module('ngMock','kpmgAngular'));

    beforeEach(function (done) {
        inject(function (/**function*/ $compile, /**ng.$rootScope.Scope*/$rootScope, $injector) {
            $scope = $rootScope.$new();
            $httpBackend = $injector.get('$httpBackend');
            directive = angular.element('<div i18n="{{key}}" i18n-options="replacements"></div>');
            directive = $compile(directive)($scope);
            $rootScope.$digest();
            $httpBackend.resetExpectations();
            oldOptions = $.i18n.options || {};
            var options = angular.extend({}, oldOptions, {getAsync: true});
            $.i18n.init(options, function () {
                $.i18n.addResourceBundle('en', 'translation', {
                    i18n: {
                        test1: 'this is a test',
                        test2: {
                            test3: '__0__ and __1__ went up the hill'
                        },
                        test3: {
                            test4: '__who__ went up the hill'
                        }
                    }
                }, true);
                done();
            });
        });
    });

    it('should translate a string key', function () {
        expect(directive.html()).toBe('');
        $scope.key = 'i18n.test1';
        $scope.$digest();
        expect(directive.html()).toBe('this is a test');
    });

    it('should translate a string key with array of replacements', function () {
        expect(directive.html()).toBe('');
        $scope.key = 'i18n.test2.test3';
        $scope.replacements = ['jack','jill'];
        $scope.$digest();
        expect(directive.html()).toBe('jack and jill went up the hill');
    });

    it('should translate a string key with object of replacements', function () {
        expect(directive.html()).toBe('');
        $scope.key = 'i18n.test3.test4';
        $scope.replacements = {who: 'jack'};
        $scope.$digest();
        expect(directive.html()).toBe('jack went up the hill');
    });

    afterEach(function () {
        $.i18n.options = oldOptions;
        $scope.$destroy();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
