describe('kpmg/angular/services/kHttpOptimizer.js', function () {



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
     * @type {kHttpOptimizer}
     */
    var service;

    beforeEach(angular.mock.module('ngMock','ngAnimate','kpmgAngular', function ($httpProvider) {
        $httpProvider.interceptors.push('kHttpOptimizer');
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kHttpOptimizer');
        $httpBackend.resetExpectations();
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    xit('should hold an $http response until animation is complete', function (done) {
        inject(function ($animate, $rootScope, $http) {
            var spy = window.jasmine.createSpy('promise'), promise,
                body = angular.element(document.body),
                test = angular.element('<div class="httpoptimizer"></div>');

            body.append('<style>.httpoptimizer.ng-enter { opacity: 0; transition: opacity 1s linear; }.httpoptimizer.ng-enter-active { opacity: 1; }</style>');
            $animate.enabled(true);
            $animate.enter(
                test,
                body
            ).finally(function () {
                expect(spy).toHaveBeenCalled();
                test.remove();
                done();
            });

            $http.get('doesnotexist').success(spy);
            $httpBackend.expectGET('doesnotexist').respond('');
            $httpBackend.flush();
            $rootScope.$digest();

            console.log(test.attr('class'));

            expect(spy).not.toHaveBeenCalled();
        });
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
