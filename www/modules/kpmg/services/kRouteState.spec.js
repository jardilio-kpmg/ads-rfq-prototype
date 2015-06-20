describe('kpmg/angular/services/kRouteState.js', function () {



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
     * @type {KRouteState}
     */
    var service, service2;

    var $location, $scope, $ngView, rootData, child1Data, child2Data, $window, timeout;

    function waitsFor(check, done) {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (!check()) {
                waitsFor(check);
            }
            else {
                done();
            }
        }, 10);
    }

    function setPath(path) {
        //the $browser service is different when using ngMock, so we need to manually update the browsers urls to test this
        $location.path(path);
        window.location.hash = '#' + path;
        $scope.$apply();
    }

    beforeEach(angular.mock.module('ngMock','kpmgAngular', function ($routeProvider) {
        //create default dummy routes
        $routeProvider
            .when('/child1', {
                template: '<h1 id="rschild1" style="position: absolute; height: 10000px; width: 10000px;">Child1</h1>'
            })
            .when('/child2', {
                template: '<h1 id="rschild2">Child2</h1>'
            })
            .otherwise({
                template: '<h1 id="rsroot">Root</h1>'
            });
    }));

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        service = $injector.get('kRouteState');
        service2 = $injector.get('kRouteState');
        $location = $injector.get('$location');
        $window = angular.element(window);
        $httpBackend.resetExpectations();

        var $compile = $injector.get('$compile');
        $scope = $injector.get('$rootScope').$new();
        $ngView = angular.element('<div id="container" style="overflow: scroll; position: absolute; height: 480px; width: 640px;"><div ng-view></div></div>');
        angular.element('body').append($ngView);
        $ngView = $compile($ngView)($scope);

        setPath('/');
    }));

    it('should be defined in module', function () {
        expect(service).toBeDefined();
    });

    it('should be a singleton', function () {
        expect(service).toBe(service2);
    });

    it('should provided correct state data when navigating between routes', function (done) {
        function stage1() {
            //below is the current state data object on route '/'
            rootData = service.data();

            //register a handler on save for leaving the current route ('/')
            service.save.on(function (data) {
                expect(data).toBe(rootData);
                data.test = 'test';
            });

            //no current state data on route '/'
            expect(rootData.test).not.toBeDefined();

            //change route to new path at '/child'
            setPath('/child1');

            //test for old data from last route ('/') state should have been saved
            expect(rootData.test).toBe('test');

            //fetch current state data
            child1Data = service.data();

            //test for new data from current route ('/child') state should be blank
            expect(child1Data).not.toBe(rootData);
            expect(child1Data.test).not.toBeDefined();

            //set scroll position before we leave view
            $ngView.scrollTop(500);
            $ngView.scrollLeft(250);

            //change route to new path at '/child2'
            setPath('/child2');

            //test for new data from current route ('/child2') state should be blank
            child2Data = service.data();
            expect(child2Data.test).not.toBeDefined();
            expect(child2Data).not.toBe(child1Data);
            expect(child2Data).not.toBe(rootData);

            $ngView.scrollTop(0);
            $ngView.scrollLeft(0);

            window.history.back();

            waitsFor(function () {
                $location.url(window.location.hash.replace('#',''));
                $location.replace();
                $scope.$apply();
                return $ngView.find('#rschild1').length;
            }, stage2);
        }
        function stage2() {
            //test that current state data is back to child1 data from previous state
            expect(service.data()).toBe(child1Data);

            //note need to increment by 1 due to chrome issue
            expect($ngView.scrollTop()).toBe(501);
            expect($ngView.scrollLeft()).toBe(251);

            //move back to previous page '/'
            window.history.back();

            waitsFor(function () {
                $location.url(window.location.hash.replace('#',''));
                $location.replace();
                $scope.$apply();
                return $ngView.find('#rsroot').length;
            }, stage3);
        }
        function stage3() {
            //test that current state data is back to old data from previous state
            expect(service.data()).toBe(rootData);
            done();
        }
        stage1();
    });

    it('should return proper name value', function () {
        expect(service.getName()).toBe('kRouteState');
    });

    afterEach(function () {
        clearTimeout(timeout);
        $ngView.remove();
        $scope.$destroy();
        window.location.hash = '';
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
